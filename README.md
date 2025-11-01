This repository contains the reference implementation of the GuitarPie technique as part of our tablature interface TabCtrl (both are described in our UIST 25 publication linked below).
Our implementation utilizes a real-time streaming variant of [Basic Pitch](https://github.com/spotify/basic-pitch) to enable the use of audio signals from an electric guitar for menu interaction.

Please note that this project is a research prototype and requires manual setup and parameter tweaking.
At his point, there is no interface for automatic setup and calibration.


### Publication

GuitarPie: Using the Fretboard of an Electric Guitar for Audio-Based Pie Menu Interaction.<br />
Frank Heyen, Marius Labudda, Michael Sedlmair, Andreas Fender.<br />
ACM UIST 2025.

Links:  [Paper on ACM DL](https://dl.acm.org/doi/10.1145/3746059.3747799), [Paper PDF (direct download)](https://www.andreasfender.com/publications/PDFs/GuitarPie_authorgenerated.pdf), [Overview video (YouTube)](https://www.youtube.com/watch?v=ItJGNO-IQDw).

Please note that this repository only contains the core GuitarPie implementation and *not* the additional audio processing features described in the paper.
Specifically, _song bookmarks_ and custom _audio commands_ are *not* included.

## Repository Overview

This repository consists of a backend and a frontend.
The backend contains an HTTP server and an audio-processing part with a websocket for streaming audio-events.
The backend is implemented in Python.
Our browser-based application TabCtrl comprises the frontend.
TabCtrl is an interactive tablature interface that uses the GuitarPie technique to enable audio-based operations, such as starting playback, navigation, switching instrument tracks, and more.
The frontend is implemented in HTML/CSS and Javascript.

Furthermore, the repository contains a "songs" folder.
Tablature files (in the Guitar Pro format, typically ".gp") can be copied to that folder to open them in TabCtrl.
Alternatively, files can be added with the "+" icon in the TabCtrl main menu.

## Installation (Python backend)

The respository was tested with [Python 3.9.2](https://www.python.org/downloads/release/python-392/).

1. Create a virtual environment and activate it:

    ```sh
    python -m venv .venv
    .venv\Scripts\activate
    ```

2. Install dependencies:

    ```sh
    pip install -r requirements.txt
    ```

3. Adjust Basic Pitch Library:

    After installation (step 2) finished, overwrite _interference.py_ in order to use basic pitch directly on audio samples:

    i. Download the edited [inference.py](https://github.com/spotify/basic-pitch/blob/2492048b29ef1363f6566fed75b8add1a812c7b3/basic_pitch/inference.py) from the pull request by _marypilataki_ (click the _Download_ button).

    ii. Navigate to your local _.venv/Lib/site-packages/basic-pitch/_ and replace _inference.py_ with the downloaded file from the pull request.

## Usage

### Starting backend

In the project root, execute the following commands, each from a different terminal.

1. Start the MIDI stream WebSocket:

    ```sh
    .venv\Scripts\activate
    python -m backend.midi_websocket
    ```
    (note that the venv environment from above has to be active, if you work with environments)

2. In a separate terminal, start the HTTP server:

    ```sh
    .venv\Scripts\activate
    python -m backend.http_server
    ```

If you want to use TabCtrl with mouse and keyboard only, then it is enough to start the HTTP server (step 2).

### Starting frontend

As long as the HTTP server is running, you can access the web app at http://localhost:8000/frontend (starting the HTTP server opens a browser with the address automatically, but only once during startup).
The TabCtrl main menu with the song selection should appear.

**Important:** Normally, the connection to the WebSocket is established automatically during startup, if the backend is running upon starting TabCtrl.
If at any time you see a pulsating connection icon in the lower-left corner of TabCtrl, then this means that the WebSocket (the MIDI backend) is not connected.
Make sure _midi_websocket.py_ is running and click on the connection icon to establish the connection.
You can also do a hard refresh to restart TabCtrl, which also initiates a connection attempt.

## Configuration

The backend accepts optional command line arguments, in particular profile:_profile_name_ and user:_username_.
Take a look at the ```activate_profile``` function inside the _backend/midi_streams/midi_stream_bp.py_ file.
This function is called upon startup and the variables _profile_ and _user_ contain the respective string values passed via the command line.
Use this function to configure parameter values for thresholds or the preferred audio device based on the profile and user.

### Audio device

Set the variable _pref_device_ to the name of the preferred device inside the ```activate_profile``` function.
The backend lists the names of all detected devices upon startup.
If a device name in the list of devices **starts with** the given string (_pref_device_), then that device is used (make sure the string you provide has enough characters to be unique in the list).

Alternatively, the preferred audio device can also be defined via command line argument with device:_devicename_ (example below).
This overrides the device name defined inside ```activate_profile``` if one was defined.

If no preferred device is provided or the provided name cannot be found in the list of connected devices, then the default audio device is used (pay attention to the console outputs).

### Example backend command line

    python -m backend.midi_websocket profile:cleanaudio user:myname "device:prefered device name"

This call sets the _profile_ variable to "cleanaudio" and the _user_ variable to "myname" (can be accessed from within the ```activate_profile``` function).
Furthermore, it sets the preferred audio device to "prefered device name", meaning that the backend will use this device if it is connected (regardless of what is defined in the profile).
Note the quotation marks for arguments that contain spaces.

## Testing

### Testing note detection (Basic Pitch)

To test the note detection (based on Basic Pitch), you can use the following script:

    python -m backend.testing.midi_test_bp

This script simply prints detected note events (without a websocket).
The optional command line arguments are the same as with the _midi_websocket.py_ above.
The ```activate_profile``` function described above is also called, so that the detection can be tested with specific settings.

### Testing websocket connection

To test the connection between the websocket and the frontend, you can type a MIDI note ID and press enter inside the terminal.
For instance, typing 62 and pressing enter sends a _D4_ note (use a MIDI note chart of the general MIDI standard to map numbers to notes).
To test only the MIDI conversion from audio input (without the websocket), you can execute



## Other tips and comments

- Make sure that all "audio enhancements" are turned off in your operating system for the audio device that you are using (your operating system might suppress non-voice input by default before it the audio stream reaches the application). Do a test recording to make sure your device works well with musical input.
- CTRL+O toggles PieMenu
- If the page is broken or you want to reset settings, reset the browser-stored menu configuration with `localStorage.clear()` in the browser console.
- The GuitarPie menu layout of the TabCtrl frontend can be customized by right-clicking with the mouse on menu elements or empty slots while the menu is open. The pie menu layout can be reset from the main menu at the top.
- Consider creating shell/bash scripts or Visual Studio Code Tasks to streamline the backend and frontend startup with the commands listed above.

## Using a MIDI device instead of Basic Pitch

You can also use a physical MIDI device (for instance a guitar MIDI pickup device) or external MIDI software (e.g., Jam Origin's MIDI Guitar).
In this case, add `--use-midi-port` as command line parameter.
You might have to change the device name in _backend/midi_stream_device.py_
`loopMIDI_ports = [p for p in available_ports if "TriplePlay Connect 1" in p]`.
Note that the other command line arguments (e.g., profile and user) and settings are not valid when using a MIDI device, as they are specific to audio devices.
