import backend.midi_streams.midi_stream_bp as midi_stream_bp
import backend.midi_streams.midi_stream_device as midi_stream_device

import websockets
import threading
import asyncio
import sys
import os
import backend.utils.logging as logging
from backend.utils.logging import print_cl


async def run_ws_midi_stream():
    async with websockets.serve(midi_stream_device.start_midi_stream, "localhost", 1002):
        await asyncio.Future()


async def run_ws_midi_stream_bp():
    print("[app] Run Websocket")
    async with websockets.serve(midi_stream_bp.serve_midi_stream_bp, "localhost", 1002):
        await asyncio.Future()


def run_ws_server(ws_func):
    asyncio.run(ws_func())



if __name__ == "__main__":
    try:
        ws_thread_midi = None
        if "--use-midi-port" in sys.argv:
            print("Using MIDI port")
            ws_thread_midi = threading.Thread(
                target=run_ws_server, args=(run_ws_midi_stream,)
            )
        else:
            print("Using Basic Pitch for MIDI conversion")
            midi_stream_bp.midi_bp_parse_command_line_arguments()
            midi_stream_bp.start_midi_stream_bp(
                True
            )  # Uses audio callback internally. No thread needed
            ws_thread_midi = threading.Thread(
                target=run_ws_server, args=(run_ws_midi_stream_bp,)
            )

        ws_thread_midi.start()

        while True:
            inp = input()
            if inp == "q":
                print("EXITING")
                os._exit(0)
                break
            try:
                note = int(inp)
                midi_stream_bp.note_to_send = note
                midi_stream_device.note_to_send = note
            except:
                pass

        ws_thread_midi.join()

    except KeyboardInterrupt:
        print("Application interrupted. Exiting...")
        os._exit(0)
    except Exception as ex:
        print_cl(f"EXCEPTION: {ex}", logging.bcolors.FAIL)
        input("Press any key")
