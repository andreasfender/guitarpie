const fretMenuRegionMenuButton_2 = document.getElementById("fretMenuRegionMenuButton_2");
const regionMenuSetRegionStartButton = document.getElementById("regionMenuSetRegionStartButton");
const regionMenuSetRegionEndButton = document.getElementById("regionMenuSetRegionEndButton");
const regionMenuSetSectionAsRegionButton = document.getElementById("regionMenuSetSectionAsRegionButton");
const regionMenuClearRegionButton = document.getElementById("regionMenuClearRegionButton");
const regionMenuToggleLoopButton = document.getElementById("regionMenuToggleLoopButton");
const statusMessageRegionMenu = document.getElementById("statusMessageRegionMenu");

const regionSubMenu = document.getElementById("regionSubMenu");

//Needs unique function with same name as action
function regionMenuToggleRegionMenu(viaMouse = false) {
    fretMenuToggleRegionMenu(viaMouse)
}

let regionSubMenuOpen = false;
function openRegionSubMenu(animation = false) {
    if (regionSubMenuOpen) {
        return;
    }
    closeFretMenu();
    regionSubMenuOpen = true;
    toggleMenuButtonAsOpen(fretMenuRegionMenuButton_2);
    regionSubMenu.style.display = "flex";
    regionSubMenu.style.animation = null;
    if (animation === true && enlargePieMenu === false) {
        regionSubMenu.style.animation = "slideInFromBottom 0.2s ease-out forwards";
    }
    setTimeout(() => {
        displayStatusMessage(statusMessageRegionMenu, "Region Menu Opened");
    }, 10);
}

function closeRegionSubMenu(animation = false) {
    if (!regionSubMenuOpen) {
        return;
    }
    regionSubMenuOpen = false;
    toggleMenuButtonAsOpen(fretMenuRegionMenuButton_2);
    regionSubMenu.style.animation = null;
    if (animation === true) {
        startingNote = undefined;
        lastNoteTime = undefined;
        clearInterval(timerInterval);
        timerInterval = undefined;
        if (enlargePieMenu === true) {
            fretMenu.style.display = "none";
            return;
        }
        regionSubMenu.style.animation = "slideOutToBottom 0.2s ease-in forwards";
        // Wait for the animation to finish before hiding the element
        regionSubMenu.addEventListener(
            "animationend",
            () => {
                regionSubMenu.style.display = "none";
            },
            { once: true }
        );
    } else {
        regionSubMenu.style.display = "none";
    }
}

function handleRegionSubMenuCommand(menuCommand, midiNote) {
    if (menuCommand === "undefined" || midiNote === "undefined") {
        return false;
    }

    switch (menuCommand) {
        case "regionMenuToggleRegionMenu":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(fretMenuRegionMenuButton_2)) {
                clickedButtons.push(fretMenuRegionMenuButton_2);
                fretMenuRegionMenuButton_2.classList.add("highlight");
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== fretMenuRegionMenuButton_2);
                    fretMenuRegionMenuButton_2.classList.remove("highlight");
                }, 2000);
                break;
            }
            fretMenuToggleRegionMenu();
            highlightMenuButton(fretMenuRegionMenuButton);
            highlightMenuButton(fretMenuRegionMenuButton_2);
            break;
        case "regionMenuSetRegionStart":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(regionMenuSetRegionStartButton)) {
                clickedButtons.push(regionMenuSetRegionStartButton);
                regionMenuSetRegionStartButton.classList.add("highlight");
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== regionMenuSetRegionStartButton);
                    regionMenuSetRegionStartButton.classList.remove("highlight");
                }, 2000);
                break;
            }
            regionMenuSetRegionStart();
            highlightMenuButton(regionMenuSetRegionStartButton);
            break;
        case "regionMenuSetRegionEnd":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(regionMenuSetRegionEndButton)) {
                clickedButtons.push(regionMenuSetRegionEndButton);
                regionMenuSetRegionEndButton.classList.add("highlight");
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== regionMenuSetRegionEndButton);
                    regionMenuSetRegionEndButton.classList.remove("highlight");
                }, 2000);
                break;
            }
            regionMenuSetRegionEnd();
            highlightMenuButton(regionMenuSetRegionEndButton);
            break;
        case "regionMenuClearRegion":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(regionMenuClearRegionButton)) {
                clickedButtons.push(regionMenuClearRegionButton);
                regionMenuClearRegionButton.classList.add("highlight");
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== regionMenuClearRegionButton);
                    regionMenuClearRegionButton.classList.remove("highlight");
                }, 2000);
                break;
            }
            regionMenuClearRegion();
            highlightMenuButton(regionMenuClearRegionButton);
            break;
        case "regionMenuToggleLoop":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(regionMenuToggleLoopButton)) {
                clickedButtons.push(regionMenuToggleLoopButton);
                regionMenuToggleLoopButton.classList.add("highlight");
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== regionMenuToggleLoopButton);
                    regionMenuToggleLoopButton.classList.remove("highlight");
                }, 2000);
                break;
            }
            regionMenuToggleLoop();
            highlightMenuButton(regionMenuToggleLoopButton);
            break;
        case "regionMenuSetSectionAsRegion":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(regionMenuSetSectionAsRegionButton)) {
                clickedButtons.push(regionMenuSetSectionAsRegionButton);
                regionMenuSetSectionAsRegionButton.classList.add("highlight");
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== regionMenuSetSectionAsRegionButton);
                    regionMenuSetSectionAsRegionButton.classList.remove("highlight");
                }, 2000);
                break;
            }
            regionMenuSetSectionAsRegion();
            highlightMenuButton(regionMenuSetSectionAsRegionButton);
            break;
        default:
            //console.log("Invalid menu command:", menuCommand);
            return false;
    }
    return true;
}

function regionMenuSetSectionAsRegion() {
    let currentBarNumber = getCurrentBarNumber();
    let section = sections.find((section) => {
        return (
            section.barNumbers[0] <= currentBarNumber &&
            section.barNumbers[section.barNumbers.length - 1] >= currentBarNumber
        );
    });
    if (section) {
        setRegionStart(section.barNumbers[0]);
        setRegionEnd(section.barNumbers[section.barNumbers.length - 1]);
        scrollToBar(section.barNumbers[0]);
    } else {
        setRegionStart(1);
        setRegionEnd(api.score.masterBars.length);
        scrollToBar(1);
    }
    setTimeout(() => {
        displayStatusMessage(statusMessageRegionMenu, "Section Set as Region");
    }, 10);
}

function regionMenuSetRegionStart(viaMouse = false) {
    let currentBarNumber = getCurrentBarNumber();
    setRegionStart(currentBarNumber);
    scrollToBar(currentBarNumber);
    setTimeout(() => {
        displayStatusMessage(statusMessageRegionMenu, "Region Start Set");
    }, 10);
}

function regionMenuSetRegionEnd(viaMouse = false) {
    let currentBarNumber = getCurrentBarNumber();
    setRegionEnd(currentBarNumber);
    scrollToBar(currentBarNumber);
    setTimeout(() => {
        displayStatusMessage(statusMessageRegionMenu, "Region End Set");
    }, 10);
}

function regionMenuClearRegion() {
    clearRegion();
    setTimeout(() => {
        displayStatusMessage(statusMessageRegionMenu, "Region Cleared");
    }, 10);
}

function regionMenuToggleLoop(viaMouse = false) {
    toggleLoop();
    setTimeout(() => {
        displayStatusMessage(statusMessageRegionMenu, "Loop: " + (loopEnabled ? "On" : "Off"));
    }, 10);
}
