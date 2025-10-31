const wrapper = document.querySelector(".at-wrap");
const main = wrapper.querySelector(".at-main");
const overlay = wrapper.querySelector(".at-overlay");
const content = wrapper.querySelector(".at-content");
const startContent = wrapper.querySelector(".start-content");

// initialize alphatab
const settings = {
    player: {
        enablePlayer: true,
        soundFont: "https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2",
        scrollElement: wrapper.querySelector(".at-viewport"),
    },
    notation: {
        rhythmMode: 2,
    },
    display: {
        staveProfile: 3,
    },
};

const api = new alphaTab.AlphaTabApi(main, settings);

// Update the dropdown when the score is loaded
api.scoreLoaded.on((score) => {
    currentScore = score;
    updateInstrumentDropdown(score);
});

api.countInVolume = 1;

let songName = undefined;
let currentTrack = undefined;

api.renderStarted.on(() => {
    overlay.style.display = "flex";
});

api.renderFinished.on(() => {
    overlay.style.display = "none";
    // console.log(api.score);
    songName = api.score.title;
    oldTrack = currentTrack;
    refreshCurrentRegion();
    if (currentTrack === undefined) {
        currentTrack = api.score.tracks[0].name;
        initTracksPanel();
    }
    if (oldTrack !== currentTrack) {
        sections = getSections();
    }
});

let ignoreSilentMessage = false;
api.playerStateChanged.on(() => {
    if (api.playerState === alphaTab.synth.PlayerState.Playing) {
        ignoreSilentMessage = true;
        setTimeout(() => {
            ignoreSilentMessage = false;
        }, 4000);
    }
});

// Keyboard shortcuts for controlling the player
document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key === "l") {
        event.preventDefault();
        if (fretMenuLocked) {
            unlockFretMenu();
        } else {
            lockFretMenu();
        }
    }

    if (event.ctrlKey && event.key === "0") {
        event.preventDefault();
        if (!countInEnabled) {
            toggleCountIn();
        }
        if (metronomeEnabled) {
            toggleMetronome();
        }
        if (loopEnabled) {
            toggleLoop();
        }
        resetTempo();
        resetVolume();
        resetZoom();
        clearRegion();
        api.stop();
        settings.player.scrollElement.scrollTop = 0;
    }

    if (event.ctrlKey && event.key === "o") {
        event.preventDefault();
        if (noFretMenuOpen()) {
            openFretMenu(true);
        } else {
            closeAllFretMenus();
        }
    }
});
