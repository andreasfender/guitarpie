function loadSong(file) {
    pauseMidiHandler = true;
    setTimeout(() => {
        pauseMidiHandler = false;
    }, 2000);
    songName = undefined;
    currentTrack = undefined;
    overlay.style.display = "flex";
    content.style.display = "block";
    startContent.style.display = "none";
    settings.file = file;
    if (api.isPlaying) {
        api.stop();
    }
    api.load(file);
    displaySidebarSongList(); // Update sidebar list for highlighting
    showFloatingButtonsAndStatus();
    homePageOpen = false;
    clearRegion();
    settings.player.scrollElement.scrollTop = 0;
    // add song to URL param

    const queryString = window.location.search
    const params = new URLSearchParams(queryString)
    params.set("song", file)
    // console.log(params.toString());
    const url = window.location.origin + window.location.pathname +'?' + params.toString()
    // console.log(url);
    window.history.replaceState({}, null, url)
}

let sections = [];
function getSections() {
    const sections = [];
    let currentSection = null;
    let currentSectionBarNumbers = [];

    api.score.masterBars.forEach((bar) => {
        // Check if song has no sections and if so create a single section called "All"
        if (bar.index === 0 && !bar.section) {
            currentSection = `All`;
        }

        if (bar.section) {
            if (currentSection) {
                sections.push({ sectionName: currentSection, barNumbers: currentSectionBarNumbers });
            }
            currentSection = `${sections.length + 1}_${bar.section.text}`;
            currentSectionBarNumbers = [];
        }
        currentSectionBarNumbers.push(bar.index + 1);
    });

    if (currentSection) {
        sections.push({ sectionName: currentSection, barNumbers: currentSectionBarNumbers });
    }

    return sections;
}

function getBarsByNumber(barNumbers) {
    let bars = [];

    const track = api.score.tracks.find((track) => track.name === currentTrack);
    track.staves.forEach((staff, staffIndex) => {
        staff.bars.forEach((tmpBar, barIndex) => {
            if (barNumbers.includes(barIndex + 1)) {
                bars.push(tmpBar);
            }
        });
    });

    return bars;
}

function detectDuplicatedBars(track) {
    const barMap = new Map();
    const duplicates = [];

    track.staves.forEach((staff, staffIndex) => {
        staff.bars.forEach((bar, barIndex) => {
            const normalizedBar = normalizeBar(bar);

            if (barMap.has(normalizedBar)) {
                const original = barMap.get(normalizedBar);
                duplicates.push({
                    duplicatedBarNumber: barIndex + 1,
                    originalBarNumber: original.barIndex + 1,
                    staffIndex,
                });
            } else {
                barMap.set(normalizedBar, { barIndex, staffIndex });
            }
        });
    });

    return duplicates;
}

function detectSilentBars(track) {
    const silentBars = [];

    track.staves.forEach((staff, staffIndex) => {
        staff.bars.forEach((bar, barIndex) => {
            if (isBarSilent(bar)) {
                silentBars.push({ barNumber: barIndex + 1, staffIndex });
            }
        });
    });

    return silentBars;
}

function isBarSilent(bar) {
    return bar.voices.every((voice) => voice.beats.every((beat) => beat.notes.length === 0));
}

function getCurrentBarNumber() {
    let tempo = api.score.tempo;
    let timeSignatureDenominator = api.score.masterBars[0].timeSignatureDenominator;
    let barDuration = ((60 / tempo) * timeSignatureDenominator) / api.playbackSpeed;
    let currentTime = api.timePosition / 1000 + 0.1; // Adding a small buffer to avoid rounding issues
    return Math.floor(currentTime / barDuration) + 1;
}

function getTickLengthOfOneBar() {
    return api.score.masterBars[2].start - api.score.masterBars[1].start;
}

let currentSections = undefined;
function initializeSections() {
    currentSections = api.score.masterBars.reduce((acc, bar, index) => {
        if (bar.section) {
            acc.push({
                startBarNumber: index,
                endBarNumber: index + bar.section.length,
                name: bar.section.name,
            });
        }
        return acc;
    }, []);
}

function scrollToBar(barNumber) {
    let tempo = api.score.tempo;
    let timeSignatureDenominator = api.score.masterBars[0].timeSignatureDenominator;
    let barDuration = ((60 / tempo) * timeSignatureDenominator) / api.playbackSpeed;
    let barStartTime = barDuration * (barNumber - 1);
    api.timePosition = barStartTime * 1000;

    setTimeout(() => {
        const cursorElement = document.querySelector(".at-cursor-bar");
        const scrollableContainer = settings.player.scrollElement;

        if (cursorElement && scrollableContainer) {
            scrollToElementInContainer(cursorElement, scrollableContainer);
        } else {
            console.error("Cursor element or scrollable container not found.");
        }
    }, 100);
}

function scrollToElementInContainer(element, container) {
    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    let scrollTop = elementRect.top - containerRect.top + container.scrollTop;
    // Add some padding to center the element
    scrollTop -= elementRect.height * 2.5;
    container.scrollTo({
        top: scrollTop,
        behavior: "smooth",
    });
}

function scrollToSection(sectionName) {
    let barNumberToScrollTo = undefined;
    if (sectionName === "All") {
        barNumberToScrollTo = 1;
    } else {
        for (let i = 0; i < api.score.masterBars.length; i++) {
            const bar = api.score.masterBars[i];
            if (bar.section) {
                if (bar.section.text === sectionName.split("_")[1]) {
                    barNumberToScrollTo = bar.index + 1;
                    break;
                }
            }
        }
    }
    if (barNumberToScrollTo) {
        scrollToBar(barNumberToScrollTo);
    }
}

function isCurrentbBarSilent() {
    if (currentTrack === undefined) {
        return false;
    }
    let currentBarNumber = getCurrentBarNumber();
    let track = api.score.tracks.find((track) => track.name === currentTrack);
    let bar = track.staves[0].bars[currentBarNumber - 1];
    return isBarSilent(bar);
}
