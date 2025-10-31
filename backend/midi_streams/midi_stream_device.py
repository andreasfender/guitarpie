from collections import Counter
import backend.utils.logging as logging
import asyncio
import mido
import json


log_stream_info = False
inport = None

# Time window for gathering notes
WINDOW_DURATION = 0.001
# Minimum fraction of messages matching the common note
MIN_CONFIDENCE_RATIO = 0.8
# Only consider note_on messages with velocity >= MIN_VELOCITY
MIN_VELOCITY = 30
note_to_send = 0
midi_websocket = None


async def get_midi_port():
    """Find and open a MIDI input port."""
    global inport

    if inport is not None:
        inport.close()
    inport = None

    try:
        available_ports = mido.get_input_names()
        logging.print_cl(
            f"Available MIDI ports: {available_ports}", logging.bcolors.OKBLUE
        )
        loopMIDI_ports = [p for p in available_ports if "TriplePlay Connect 1" in p]

        if loopMIDI_ports:
            selected_port = loopMIDI_ports[0]
        elif available_ports:
            selected_port = available_ports[0]
        else:
            logging.print_cl("No MIDI ports available", logging.bcolors.WARNING)
            return None

        logging.print_cl(f"Using MIDI port: {selected_port}", logging.bcolors.OKBLUE)
        return mido.open_input(selected_port)

    except IOError as e:
        logging.print_cl(f"Error opening MIDI port: {e}", logging.bcolors.FAIL)
        return None


async def collect_midi_notes():
    """Collect MIDI messages over the defined time window."""
    start_time = asyncio.get_event_loop().time()
    notes = []

    while asyncio.get_event_loop().time() - start_time < WINDOW_DURATION:
        for msg in inport.iter_pending():
            if msg.type == "note_on" and msg.velocity >= MIN_VELOCITY:
                notes.append(msg.note)
        await asyncio.sleep(0.001)

    return notes


async def send_midi_note(common_note):
    # Send detected MIDI note to frontend
    try:
        print(common_note)
        message = {"midi_note": common_note}
        logging.print_cl(f"Sending MIDI note: {common_note}", logging.bcolors.OKGREEN)
        global midi_websocket
        await midi_websocket.send(json.dumps(message))
        await asyncio.sleep(0.01)
    except Exception as e:
        logging.print_cl(f"Error sending message: {e}", logging.bcolors.FAIL)


async def start_midi_stream(websocket, path):
    """Process MIDI input and send detected notes to the frontend."""
    global midi_websocket
    if midi_websocket is not None:
        try:
            await midi_websocket.close()
            logging.print_cl("Closed old websocket connection", logging.bcolors.OKCYAN)
        except Exception as e:
            logging.print_cl(
                f"Failed to close old websocket: {e}", logging.bcolors.FAIL
            )

    midi_websocket = websocket
    global inport

    inport = await get_midi_port()
    # if inport is None:
    #    await asyncio.sleep(3)
    #    return

    last_note_time = asyncio.get_event_loop().time()
    silent_sent = False

    try:
        logging.print_cl("Starting MIDI stream...", logging.bcolors.OKCYAN)
        global note_to_send

        while not websocket.closed:
            # print(note_to_send)
            if note_to_send > 0:

                await send_midi_note(note_to_send)
                note_to_send = 0

            if inport != None:
                current_time = asyncio.get_event_loop().time()
                notes = await collect_midi_notes()

                if not notes:
                    # Check if it's been more than 2.5 seconds since last note
                    if (current_time - last_note_time) > 2.5 and not silent_sent:
                        try:
                            await websocket.send(json.dumps({"midi_note": "silent"}))
                            logging.print_cl(
                                "No notes for 2.5s. Sent 'silent' message",
                                logging.bcolors.OKCYAN,
                            )
                            silent_sent = True
                        except Exception as e:
                            logging.print_cl(
                                f"Error sending 'silent': {e}", logging.bcolors.FAIL
                            )
                            break
                    if log_stream_info:
                        logging.print_cl("No notes detected", logging.bcolors.WARNING)
                    await asyncio.sleep(0.01)
                    continue

                # Determine most common note
                counts = Counter(notes)
                common_note, freq = counts.most_common(1)[0]

                # Only proceed if the confidence ratio is met
                if freq / len(notes) < MIN_CONFIDENCE_RATIO:
                    if log_stream_info:
                        logging.print_cl(
                            "Confidence threshold not met", logging.bcolors.WARNING
                        )
                    continue

                last_note_time = current_time
                silent_sent = False

                if log_stream_info:
                    logging.print_cl(
                        f"Detected note: {common_note}", logging.bcolors.OKGREEN
                    )

                await send_midi_note(common_note)

    except Exception as e:
        logging.print_cl(f"Error in MIDI stream: {e}", logging.bcolors.FAIL)
        inport.close()
        return

    finally:
        logging.print_cl("Closing MIDI port...", logging.bcolors.BOLD)
        inport.close()
