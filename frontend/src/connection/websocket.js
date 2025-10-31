const webSocketDisconnectedIcon = document.getElementById("websocket-disconnected-icon");

let midiSocket;

function startMidiStream() {
    if (!midiSocket || midiSocket.readyState === WebSocket.CLOSED) {
        midiSocket = new WebSocket("ws://localhost:1002");

        midiSocket.onopen = function (event) {
            webSocketDisconnectedIcon.style.display = "none";
            console.log("MIDI WebSocket connection established.");
        };

        midiSocket.onmessage = function (event) {
            try {
                const data = JSON.parse(event.data);

                if (
                    api.playerState === alphaTab.synth.PlayerState.Playing &&
                    !ignoreSilentMessage &&
                    pauseOnSilence &&
                    !isCurrentbBarSilent()
                ) {
                    if (data.midi_note === "silent") {
                        api.pause();
                        return;
                    }
                }

                if (data.midi_note !== undefined) {
                    handleMidiNote(data.midi_note);
                }
            } catch (error) {
                console.error("Error in onmessage handler:", error);
            }
        };

        midiSocket.onerror = function (error) {
            webSocketDisconnectedIcon.style.display = "block";
            console.error("MIDI WebSocket Error: ", error);
        };

        midiSocket.onclose = function (event) {
            webSocketDisconnectedIcon.style.display = "block";
            console.log("MIDI WebSocket connection closed.");
        };
    }
}

function endMidiStream() {
    if (midiSocket && midiSocket.readyState === WebSocket.OPEN) {
        midiSocket.close();
    }
}

function restartWebSockets() {
    if (midiSocket && midiSocket.readyState === WebSocket.OPEN) {
        midiSocket.close();
    }

    webSocketDisconnectedIcon.style.animationDuration = "1s";

    setTimeout(() => {
        startMidiStream();
        webSocketDisconnectedIcon.style.animationDuration = "2s";
    }, 2000);
}
