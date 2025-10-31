
import backend.midi_streams.midi_stream_bp as midibp
import os

#def on_note_starts(midi_note_id, velocity, start_time):
#    print(f"{midi_note_id}")

### Minimal Single-threaded Basic Pitch MIDI test without webserver
if __name__ == "__main__":
    try:
        midibp.midi_bp_parse_command_line_arguments()

        #midibp.print_cl("CREATE THREAD")
        #ws_thread = threading.Thread(target=midibp.start_midi_stream_bp)

        midibp.print_cl("START")
        midibp.start_midi_stream_bp(False) # Disable audio buffer callback (read audio manually below)
        #ws_thread.start()

        #midibp.note_callback = on_note_starts

        while True:
            midibp.read_audio_window_now()

        #input("Key to quit")
        #os._exit(0)

        #ws_thread.join()
    except KeyboardInterrupt:
        midibp.print_cl("Application interrupted. Exiting...")
        os._exit(0)
    finally:
        pass
