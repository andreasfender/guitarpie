import asyncio

import backend.utils.logging as logging
import backend.utils.notes_util as notes_util
from backend.utils.logging import print_cl
import sounddevice as sd
import numpy as np
import json
import basic_pitch.inference as bp
import matplotlib.pyplot as plt
from typing import List

import sys

total_seconds = 0
lst_note_seconds = 0
lst_note_pitch = 0

# Only used when not using overlapping window
note_states: List[int] = [0] * 200
notes_previous_window = [0] * 12
win_overlap_sample_count = 0
midi_websocket = None
note_to_send = 0
filter_octaves = True
filter_octave_sequences = True
print_low_notes = True

prev_uData = []
profile = "default"
user = ""
send_silence_pending = False
new_silence_ok = False

## DEFAULT VALUES. Can be changed via profiles
onset_threshold = 0.5  # 0.5
frame_threshold = 0.3  # 0.3
minimum_note_length = 80  # 127.70 #milliseconds # needs to be below half overlap size
min_loudness = 0.01
min_note_diff_millis = 100
needs_silence = False
warmup_milli_seconds = 0
min_velocity = 60
note_to_send = 0
## Device parameters
block_millis = 80
pref_device = ""
channels = 1
use_channel = 0
latency = "low"

bp_send_silence = True
silence_send_delay = 3

total_samples = 0
lst_loud = -1
devId = -1

note_callback = None
print_note_callback = None
sample_callback = None

# Define custom profiles and user-specific settings here
def activate_profile():
    global profile
    global channels, pref_device, latency, block_millis
    global min_note_diff_millis, silence_send_delay, bp_send_silence, min_velocity
    global warmup_milli_seconds, onset_threshold, frame_threshold, minimum_note_length
    global min_loudness, use_channel, needs_silence

    if user == "my_user_name":
        # Custom settings per-user / per-collaborator here. Use "user:my_user_name" as command line argument.
        pass

    if profile == "default":
        print("Using default profile")
        return
    elif profile == "rocksmith":
        onset_threshold = 0.4  # 0.5
        frame_threshold = 0.3  # 0.3
        minimum_note_length = (
            100  # 127.70 #milliseconds # needs to be below half overlap size
        )
        min_loudness = 0.1
    elif profile == "stereo":
        channels = 2
        use_channel = 0
        min_loudness = 0.025
    elif profile == "pianomic":
        channels = 1
        # onset_threshold = 2
        # frame_threshold = 0.5
        min_loudness = 0.02
        block_millis = 80
        min_note_diff_millis = 100
        min_velocity = 60
        warmup_milli_seconds = 0
        # needs_silence = True
        minimum_note_length = 80

        ## Example for setting device for this profile based on user:
        # if user == "my_user_name":
        #    pref_device = "RØDE VideoMic GO" # Use exact device name as shown in the device list when starting backend
    elif profile == "ampmic" or profile == "distorted":
        channels = 1
        onset_threshold = 2
        frame_threshold = 0.5
        # latency = "high"
        min_loudness = 0.1
        block_millis = 80
        min_note_diff_millis = 100
        min_velocity = 60
        warmup_milli_seconds = 0
        # needs_silence = True
        minimum_note_length = 80
    else:
        print_cl(f"Profile not found: '{profile}'", logging.bcolors.FAIL)
        return

    print_cl(f"Using profile: '{profile}'", logging.bcolors.OKGREEN)


"""Print colored without prefix"""

def print_note(midi_note_id, velocity, time, action, cl, prefix=" - "):
    text = f"{prefix}{notes_util.midi_note_id_to_string(midi_note_id)} ({midi_note_id}) w/v{velocity} at {round(time, 3)} of window {round(total_seconds, 3)} {action}"
    if print_note_callback != None:
        if not print_note_callback(text, cl):
            return
    print_cl(text, cl)


def on_note_starts(midi_note_id, velocity, start_time):

    global note_callback
    print_note(
        midi_note_id,
        velocity,
        start_time,
        "starts (send)" if midi_websocket != None else "starts",
        logging.bcolors.OKGREEN,
        "OK ",
    )

    if note_callback != None:
        note_callback(midi_note_id, velocity, start_time)
    global lst_note_seconds, lst_note_pitch
    global note_to_send
    note_to_send = midi_note_id
    lst_note_seconds = start_time
    lst_note_pitch = midi_note_id


def on_note_ends(midi_note_id, end_time):
    print_note(midi_note_id, 0, end_time, "ends", logging.bcolors.OKBLUE)


def process_audio(indata):
    """Extracts MIDI from an audio signal using Basic Pitch."""

    global prev_uData
    global plot_next
    global profile
    plot_next = False
    global total_samples

    global channels
    global silence_send_delay, bp_send_silence, onset_threshold, frame_threshold, minimum_note_length, min_loudness, use_channel

    try:
        infloats = indata.flatten()
        if channels > 1:
            infloats = infloats[use_channel::2]

        if sample_callback != None:
            sample_callback(infloats)

        total_samples += len(infloats)

        global lst_loud
        global filter_octaves
        global window_debug
        global print_silence
        global window_counter
        global prev_window
        global total_seconds
        global prev_silent
        global print_discarded_notes
        global lst_note_seconds, lst_note_pitch
        global win_overlap_percent
        global min_velocity
        global needs_silence
        global send_silence_pending
        global new_silence_ok

        data_l = len(infloats)
        data_window_seconds = data_l / notes_util.SAMPLE_RATE

        first_window = window_counter < 1

        instr_ok = False

        if first_window:
            print("\n")

        if not first_window:

            uData = np.concatenate((prev_window, infloats))

            expanded_window_seconds = len(uData) / notes_util.SAMPLE_RATE
            overlap_seconds = len(prev_window) / notes_util.SAMPLE_RATE
            overlap_millis = overlap_seconds * 1000
            total_seconds -= overlap_seconds

            current_note_octaves = [0] * 12
            global min_loudness
            loudness = np.max(
                np.abs(infloats)
            )  # Changed to max, otherwise notes at the end of a mostly silent window not detected
            if window_debug:
                print_cl(
                    f"Loudness: {loudness} / {min_loudness}",
                    (
                        logging.bcolors.BOLD
                        if loudness >= min_loudness
                        else logging.bcolors.LOW
                    ),
                )

            if loudness >= min_loudness:
                new_silence_ok = True
                lst_loud = total_seconds
                global warmup_milli_seconds
                cooldown_milli_seconds = 0

                earliest_seconds = warmup_milli_seconds / 1000
                latest_seconds = expanded_window_seconds - cooldown_milli_seconds / 1000

                # print(f"{win_overlap_sample_count} {use_overlap} {len(prev_window)} {overlap_millis} {overlap_seconds} {warmup_milli_seconds} {earliest_seconds}")
                if window_debug:
                    print_cl(
                        f"{window_counter} - Samples: {len(prev_window)} + {len(infloats)} = {len(uData)}; Total seconds: {expanded_window_seconds}, earliest: {earliest_seconds}, latest: {latest_seconds}"
                    )

                ## IF YOU RECEIVE "Unexpected argument audio_path_or_array" --> check whether using correct environment / use correct inference.py. See Readme.md
                model_output, midi_data, _ = bp.predict(
                    audio_path_or_array=uData,
                    sample_rate=notes_util.SAMPLE_RATE,
                    onset_threshold=onset_threshold,  # 0.5
                    frame_threshold=frame_threshold,  # 0.3
                    minimum_note_length=minimum_note_length,  # 127.70 #milliseconds # needs to be below half overlap size
                    multiple_pitch_bends=False,
                    melodia_trick=True,
                    midi_tempo=120,
                    verbose=False,
                )

                """
                    ROCKSMITH CABLE
                    model_output, midi_data, _ = bp.predict(
                    audio_path_or_array=uData, sample_rate=utils.SAMPLE_RATE,
                    onset_threshold = 0.7, #0.5
                    frame_threshold = 0.4, #0.3
                    minimum_note_length = 60, #127.70, #milliseconds # needs to be below half overlap size
                    multiple_pitch_bends = False,
                    melodia_trick = True,
                    midi_tempo = 120,
                    verbose = False
                )
                
                """
                instr_ok = len(midi_data.instruments) > 0
                if instr_ok:
                    if len(midi_data.instruments) > 1:
                        print_cl(
                            "WARNING: More than one instrument", logging.bcolors.WARNING
                        )
                    instr = midi_data.instruments[0]
                    notes = instr.notes
                    if verbose_notes:
                        print_cl(f"NOTES: {len(notes)}")
                        for note in notes:
                            print_cl(f"\t{note}")

                    for note in notes:
                        p = note.pitch
                        t = total_seconds + note.start
                        v = note.velocity
                        delta = (t - lst_note_seconds) * 1000

                        within_octave = notes_util.get_id_within_octave(p)
                        octave_num = notes_util.get_octave_num(p)
                        if filter_octaves:
                            prev_oct = current_note_octaves[within_octave]
                            if prev_oct > 0 and prev_oct < octave_num:
                                if print_discarded_notes:
                                    print_note(
                                        p,
                                        v,
                                        t,
                                        f"lower octave active: {prev_oct})",
                                        logging.bcolors.WARNING,
                                    )
                            else:
                                current_note_octaves[within_octave] = octave_num
                        else:
                            current_note_octaves[within_octave] = octave_num

                        if v < min_velocity:
                            if print_discarded_notes and print_low_notes:
                                print_note(p, v, t, "too low", logging.bcolors.LOW)
                        elif note.start < earliest_seconds:
                            if print_discarded_notes:
                                print_note(p, v, t, "too early", logging.bcolors.WARNING)
                        elif note.start > latest_seconds:
                            if print_discarded_notes:
                                print_note(p, v, t, "too late", logging.bcolors.WARNING)
                        else:

                            prev_within_octave = notes_util.get_id_within_octave(
                                lst_note_pitch
                            )
                            if (
                                filter_octave_sequences
                                and lst_note_pitch < p
                                and prev_within_octave == within_octave
                            ):
                                if print_discarded_notes:
                                    print_note(
                                        p,
                                        v,
                                        t,
                                        f"octave sequence (lst: {notes_util.midi_note_id_to_string(lst_note_pitch)})",
                                        logging.bcolors.WARNING,
                                    )
                            else:

                                lst_note_seconds = t
                                if delta < min_note_diff_millis:
                                    if print_discarded_notes:
                                        print_note(
                                            p,
                                            v,
                                            t,
                                            f"too quick (lst: {round(lst_note_seconds,3)})",
                                            logging.bcolors.WARNING,
                                        )
                                else:
                                    if not needs_silence or prev_silent:
                                        on_note_starts(p, v, t)
                                        prev_silent = False
                        if t > lst_note_seconds:
                            t = lst_note_seconds

                else:
                    if window_debug or verbose_notes:
                        print_cl("No instrument")
            else:
                prev_silent = True
                if print_silence:
                    print_cl("Silence")
                if (
                    new_silence_ok
                    and bp_send_silence
                    and total_seconds - lst_loud > silence_send_delay
                ):
                    send_silence_pending = True
                    new_silence_ok = False

            total_seconds += expanded_window_seconds
        else:
            # first window
            total_seconds += data_window_seconds

        ### END OF FRAME, Copy to buffer for next window
        window_counter += 1

        prev_window = infloats[data_l - data_l * win_overlap_percent // 100 :]

        ### PLOTTING
        if window_counter > 3:
            global plot_raw
            if plot_raw or plot_next:

                global fig
                global rawsubfig
                global rawplot, rawplot2
                global bpsubfig
                global bpplot
                plot_next = False
                if fig == None:
                    print_cl("INIT plots")
                    plt.ion()
                    my_dpi = 100
                    fig = plt.figure(figsize=(1600 / my_dpi, 800 / my_dpi), dpi=my_dpi)
                    fig.canvas.manager.set_window_title("Plots")
                    rawsubfig = fig.add_subplot()
                    rawsubfig.set_title("Raw audio")
                    (rawplot,) = rawsubfig.plot(np.arange(0, len(uData), 1), uData)

                rawplot.set_ydata(uData)
                plt.gca().set_ylim([-1, 1])
                fig.canvas.draw()
                fig.canvas.flush_events()

        if window_counter > 1:
            prev_uData = uData[:]
    except Exception as e:
        print_cl(f"Exception: {e}", logging.bcolors.FAIL)
        return None


def _audio_callback(indata, frames, time, status):
    process_audio(indata=indata)
    pass


def read_audio_window_now():
    global window_size
    data, over = stream.read(window_size)
    if over:
        print_cl(f"Overflow {len(data)}", logging.bcolors.FAIL)

    process_audio(data)


#'''Non-blocking. Starts audio stream and listens to callbacks'''
def start_midi_stream_bp(callback_based):

    global fig
    fig = None

    print_cl("CHECKING AUDIO DEVICES", logging.bcolors.OKCYAN)

    global pref_device

    uDev = None
    if pref_device != "" and pref_device != None:
        found = False
        for dev in sd.query_devices():
            name = dev["name"]
            if name.startswith(pref_device):
                print_cl(f"Found preferred device: {name}", logging.bcolors.OKGREEN)
                uDev = dev
                found = True
                break
        if not found:
            print_cl(f"Preferred device not found: {pref_device}. Using default", logging.bcolors.FAIL)
    else:
        print("No preferred device specified. Using default.")

    """Start the audio stream and perform audio matching."""

    try:
        print_cl("Starting audio stream...", logging.bcolors.OKCYAN)

        global window_counter
        window_counter = 0
        global stream

        print_cl(sd.query_devices())

        global latency
        global block_millis
        global window_size
        window_size = notes_util.SAMPLE_RATE * block_millis // 1000
        global win_overlap_percent
        win_overlap_sample_count = window_size * win_overlap_percent // 100
        global devId
        devId = uDev["index"] if uDev != None else None
        stream = sd.InputStream(
            samplerate=notes_util.SAMPLE_RATE,
            channels=channels,
            latency=latency,
            device=devId,
            blocksize=window_size,
            callback=_audio_callback if callback_based else None,
        )
        stream.start()

        print_cl(
            f"\nSound device ID: {stream.device}"
        )  # , device sample rate: {stream.device['default_samplerate']}
        print_cl(
            f"Window size: {window_size}, overlap%: {win_overlap_percent}, overlap samples: {win_overlap_sample_count}, window millis: {window_size / notes_util.SAMPLE_RATE * 1000},  overlap millis: {win_overlap_sample_count / notes_util.SAMPLE_RATE * 1000}",
            logging.bcolors.OKCYAN,
        )

    finally:
        pass


def midi_bp_parse_command_line_arguments():
    global verbose_notes
    verbose_notes = False
    global print_note_start
    print_note_start = True
    global print_note_end
    print_note_end = True
    global plot_raw
    plot_raw = False
    global prev_window
    prev_window = []
    global window_debug
    window_debug = False
    global print_silence
    print_silence = False
    global print_discarded_notes
    print_discarded_notes = True
    global win_overlap_percent
    win_overlap_percent = 100
    global filter_octaves, filter_octave_sequences
    global profile, user
    global pref_device

    override_device = None

    argcl = logging.bcolors.OKGREEN
    for i in range(1, len(sys.argv)):
        arg = sys.argv[i]
        if arg == "--basic-pitch" or arg == "--midi-only":
            pass
        elif arg.startswith("profile:"):
            profile = arg[len("profile:") :]
        elif arg.startswith("user:"):
            user = arg[len("user:") :]
            print_cl(f"Setting user: '{user}'", argcl)
        elif arg.startswith("device:"):
            override_device = arg[len("device:") :]
        elif arg == "filteroctavesoff":
            print_cl("Turning OFF octave filtering", argcl)
            filter_octaves = False
        elif arg == "filteroctaves" or arg == "filteroctaveson":
            print_cl("Turning ON octave filtering", argcl)
            filter_octaves = True
        elif arg == "filterctavesequencesoff":
            print_cl("Turning OFF octave sequence filtering", argcl)
            filter_octave_sequences = False
        elif arg == "printnotes":
            print_cl("Printing notes", argcl)
            verbose_notes = True
        elif arg == "printwindow" or arg == "windowdebug":
            print_cl("Printing window debug", argcl)
            window_debug = True
        elif arg == "printsilence":
            print_cl("Printing silence", argcl)
            print_silence = True
        elif arg == "printnotestartoff":
            print_note_start = False
        elif arg == "printnotesendoff":
            print_note_end = False
        elif arg == "printdiscardednotes":
            print_cl("Printing discarded notes", argcl)
            print_discarded_notes = True
        elif arg == "plotrawoff":
            print_cl("Turning OFF raw plot", argcl)
            plot_raw = False
        elif arg == "plotraw":
            print_cl("Turning ON raw plot", argcl)
            plot_raw = True
        elif arg == "overlap25":
            print_cl("Setting overlap to 25%", argcl)
            win_overlap_percent = 25
        elif arg == "overlap50":
            print_cl("Setting overlap to 50%", argcl)
            win_overlap_percent = 50
        elif arg == "overlap75":
            print_cl("Setting overlap to 75%", argcl)
            win_overlap_percent = 75
        elif arg == "overlap100":
            print_cl("Setting overlap to 100%", argcl)
            win_overlap_percent = 100
        elif arg == "overlapoff" or arg == "overlap0":
            print_cl("Turning off overlap", argcl)
            win_overlap_percent = 0
        else:
            print_cl(f"INVALID ARGUMENT: {arg}", logging.bcolors.FAIL)

    if filter_octaves:
        print("Filtering octaves")
    activate_profile()

    if override_device != None:
        print(f"Using command-line argument as preferred device: {override_device}")
        pref_device = override_device


async def serve_midi_stream_bp(websocket, path):
    """Main function to process MIDI input produced by basic pitch and send commands to the frontend."""
    try:
        global midi_websocket
        if midi_websocket is not None:
            try:
                await midi_websocket.close()
                logging.print_cl(
                    "Closed old websocket connection", logging.bcolors.OKCYAN
                )
            except Exception as e:
                logging.print_cl(
                    f"Failed to close old websocket: {e}", logging.bcolors.FAIL
                )

        midi_websocket = websocket
        global note_to_send
        global send_silence_pending

        logging.print_cl(
            "Basic pitch MIDI stream websocket started", logging.bcolors.OKCYAN
        )

        while not websocket.closed:
            # read_audio_window_now()  # Legacy: blocking audio window buffer acquisition inside websocket loop.

            await asyncio.sleep(0.01)
            if send_silence_pending:
                if midi_websocket != None:
                    try:
                        message = {"midi_note": "silent"}
                        logging.print_cl(f"Sending 'silent'", logging.bcolors.OKGREEN)
                        await midi_websocket.send(json.dumps(message))
                        await asyncio.sleep(0.001)
                    except Exception as e:
                        logging.print_cl(
                            f"Error sending message: {e}", logging.bcolors.FAIL
                        )
                send_silence_pending = False

            if note_to_send > 0:
                if midi_websocket != None:
                    try:
                        message = {"midi_note": str(note_to_send)}

                        logging.print_cl(
                            f"Sending MIDI note: {note_to_send}", logging.bcolors.OKGREEN
                        )
                        await midi_websocket.send(json.dumps(message))
                        await asyncio.sleep(0.001)
                    except Exception as e:
                        logging.print_cl(
                            f"Error sending message: {e}", logging.bcolors.FAIL
                        )
                note_to_send = 0

    except Exception as e:
        logging.print_cl(
            f"Error in basic pitch MIDI stream: {e}", logging.bcolors.FAIL
        )
        return

    finally:
        logging.print_cl("Closing basic pitch MIDI stream...", logging.bcolors.BOLD)
        await midi_websocket.close()
