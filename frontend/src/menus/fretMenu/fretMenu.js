const fretMenuLockButton = document.getElementById("fretMenuLockButton")
const fretMenuRegionMenuButton = document.getElementById("fretMenuRegionMenuButton")
const fretMenuPlayPauseButton = document.getElementById("fretMenuPlayPauseButton")
const fretMenuToolsButton = document.getElementById("fretMenuToolsButton")
const fretMenuJumpSectionBackwardButton = document.getElementById("fretMenuJumpSectionBackwardButton")
const fretMenuJumpBackwardButton = document.getElementById("fretMenuJumpBackwardButton")
const fretMenuCloseButton = document.getElementById("fretMenuCloseButton")
const fretMenuJumpForwardButton = document.getElementById("fretMenuJumpForwardButton")
const fretMenuJumpSectionForwardButton = document.getElementById("fretMenuJumpSectionForwardButton")
const fretMenuTrackMenuButton = document.getElementById("fretMenuTrackMenuButton")
const fretMenuStopButton = document.getElementById("fretMenuStopButton")
const fretMenuHomeButton = document.getElementById("fretMenuHomeButton")
const statusMessageFretMenu = document.getElementById("statusMessageFretMenu")


// const fretMenuCountInButton2Main = document.getElementById("fretMenuCountInButton2Main")



const fretMenuLockedIndicator = document.getElementById("fret-menu-locked-indicator")
fretMenuLockedIndicator.addEventListener("mouseover", () => {
    fretMenuLockedIndicator.src = "./resources/codicons/dark/unlock.svg"
})
fretMenuLockedIndicator.addEventListener("mouseout", () => {
    fretMenuLockedIndicator.src = "./resources/codicons/dark/lock.svg"
})

const fretMenu = document.getElementById("fretMenu")

const showFretMenuButton = document.getElementById("showFretMenuButton")
showFretMenuButton.onclick = () => {
    openFretMenu(true)
    closeAllPanels()
}

let fretMenuOpen = false

function openFretMenu(animation = false) {
    console.log('opening menu')
    if (fretMenuOpen) {
        console.log('menu already open')
        return
    }
    closeToolsSubMenu()
    closeTrackSubMenu()
    closeRegionSubMenu()
    fretMenuOpen = true
    fretMenu.style.display = "flex"
    fretMenu.style.animation = null
    if (animation === true && enlargePieMenu === false) {
        fretMenu.style.animation = "slideInFromBottom 0.2s ease-out forwards"
    }
    toggleMenuButtonAsOpen(fretMenuCloseButton)
    if (animation === false) {
        setTimeout(() => {
            displayStatusMessage(statusMessageFretMenu, "Fret Menu Opened")
        }, 10)
    }
    localStorage.setItem('menuOpen', 'true')
}

function closeFretMenu(animation = false) {
    localStorage.setItem('menuOpen', 'false')
    if (!fretMenuOpen) {
        return
    }
    closeToolsSubMenu()
    closeTrackSubMenu()
    closeRegionSubMenu()
    fretMenuOpen = false
    fretMenu.style.animation = null
    if (animation === true) {
        startingNote = undefined
        lastNoteTime = undefined
        clearInterval(timerInterval)
        timerInterval = undefined
        if (enlargePieMenu === true) {
            fretMenu.style.display = "none"
            return
        }
        fretMenu.style.animation = "slideOutToBottom 0.2s ease-in forwards"
        // Wait for the animation to finish before hiding the element
        fretMenu.addEventListener(
            "animationend",
            () => {
                fretMenu.style.display = "none"
            },
            { once: true }
        )
    } else {
        fretMenu.style.display = "none"
    }
    toggleMenuButtonAsOpen(fretMenuCloseButton)
}

let fretMenuLocked = false
function lockFretMenu() {
    if (fretMenuLocked) {
        return
    }
    fretMenuLocked = true
    updateFretMenuLockButton(fretMenuLocked)
    closeAllFretMenus()
}

function unlockFretMenu() {
    if (!fretMenuLocked) {
        return
    }
    pauseMidiHandler = true
    setTimeout(() => {
        pauseMidiHandler = false
    }, 2000)
    fretMenuLocked = false
    updateFretMenuLockButton(fretMenuLocked)
    closeAllFretMenus()
}

let clickedButtons = []

const fretMenuLockIcon = document.getElementById("fretMenuLockIcon")
function updateFretMenuLockButton(isLocked) {
    fretMenuLockIcon.src = isLocked ? "./resources/codicons/light/lock.svg" : "./resources/codicons/light/unlock.svg"
    fretMenuLockIcon.alt = isLocked ? "Locked" : "Unlocked"
    fretMenuLockedIndicator.style.display = isLocked ? "block" : "none"
}

function handleFretMenuCommand(menuCommand, midiNote) {
    if (menuCommand === "undefined" || midiNote === "undefined") {
        return false
    }
    switch (menuCommand) {
        case "fretMenuToggleLock":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(fretMenuLockButton)) {
                clickedButtons.push(fretMenuLockButton)
                fretMenuLockButton.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== fretMenuLockButton)
                    fretMenuLockButton.classList.remove("highlight")
                }, 2000)
                break
            }
            fretMenuToggleLock()
            highlightMenuButton(fretMenuLockButton)
            break
        case "fretMenuTogglePlayPause":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(fretMenuPlayPauseButton)) {
                clickedButtons.push(fretMenuPlayPauseButton)
                fretMenuPlayPauseButton.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== fretMenuPlayPauseButton)
                    fretMenuPlayPauseButton.classList.remove("highlight")
                }, 2000)
                break
            }
            fretMenuTogglePlayPause()
            highlightMenuButton(fretMenuPlayPauseButton)
            break
        case "fretMenuToggleToolsMenu":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(fretMenuToolsButton)) {
                clickedButtons.push(fretMenuToolsButton)
                fretMenuToolsButton.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== fretMenuToolsButton)
                    fretMenuToolsButton.classList.remove("highlight")
                }, 2000)
                break
            }
            fretMenuToggleToolsMenu()
            highlightMenuButton(fretMenuToolsButton)
            break
        case "fretMenuJumpSectionBackward":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(fretMenuJumpSectionBackwardButton)) {
                clickedButtons.push(fretMenuJumpSectionBackwardButton)
                fretMenuJumpSectionBackwardButton.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== fretMenuJumpSectionBackwardButton)
                    fretMenuJumpSectionBackwardButton.classList.remove("highlight")
                }, 2000)
                break
            }
            fretMenuJumpSectionBackward()
            highlightMenuButton(fretMenuJumpSectionBackwardButton)
            break
        case "fretMenuJumpBackward":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(fretMenuJumpBackwardButton)) {
                clickedButtons.push(fretMenuJumpBackwardButton)
                fretMenuJumpBackwardButton.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== fretMenuJumpBackwardButton)
                    fretMenuJumpBackwardButton.classList.remove("highlight")
                }, 2000)
                break
            }
            fretMenuJumpBackward()
            highlightMenuButton(fretMenuJumpBackwardButton)
            break
        case "fretMenuOpen":
            _fretMenuOpen()
            break
        case "fretMenuClose":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(fretMenuCloseButton)) {
                clickedButtons.push(fretMenuCloseButton)
                fretMenuCloseButton.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== fretMenuCloseButton)
                    fretMenuCloseButton.classList.remove("highlight")
                }, 2000)
                break
            }
            _fretMenuClose()
            highlightMenuButton(fretMenuCloseButton)
            break
        case "fretMenuJumpForward":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(fretMenuJumpForwardButton)) {
                clickedButtons.push(fretMenuJumpForwardButton)
                fretMenuJumpForwardButton.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== fretMenuJumpForwardButton)
                    fretMenuJumpForwardButton.classList.remove("highlight")
                }, 2000)
                break
            }
            fretMenuJumpForward()
            highlightMenuButton(fretMenuJumpForwardButton)
            break
        case "fretMenuJumpSectionForward":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(fretMenuJumpSectionForwardButton)) {
                clickedButtons.push(fretMenuJumpSectionForwardButton)
                fretMenuJumpSectionForwardButton.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== fretMenuJumpSectionForwardButton)
                    fretMenuJumpSectionForwardButton.classList.remove("highlight")
                }, 2000)
                break
            }
            fretMenuJumpSectionForward()
            highlightMenuButton(fretMenuJumpSectionForwardButton)
            break
        case "fretMenuToggleTrackMenu":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(fretMenuTrackMenuButton)) {
                clickedButtons.push(fretMenuTrackMenuButton)
                fretMenuTrackMenuButton.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== fretMenuTrackMenuButton)
                    fretMenuTrackMenuButton.classList.remove("highlight")
                }, 2000)
                break
            }
            fretMenuToggleTrackMenu()
            highlightMenuButton(fretMenuTrackMenuButton)
            break
        case "fretMenuStopSong":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(fretMenuStopButton)) {
                clickedButtons.push(fretMenuStopButton)
                fretMenuStopButton.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== fretMenuStopButton)
                    fretMenuStopButton.classList.remove("highlight")
                }, 2000)
                break
            }
            fretMenuStopSong()
            highlightMenuButton(fretMenuStopButton)
            break
        case "fretMenuToggleRegionMenu":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(fretMenuRegionMenuButton)) {
                clickedButtons.push(fretMenuRegionMenuButton)
                fretMenuRegionMenuButton.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== fretMenuRegionMenuButton)
                    fretMenuRegionMenuButton.classList.remove("highlight")
                }, 2000)
                break
            }
            fretMenuToggleRegionMenu()
            highlightMenuButton(fretMenuRegionMenuButton)
            break
        case "fretMenuToggleHomeMenu":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(fretMenuHomeButton)) {
                clickedButtons.push(fretMenuHomeButton)
                fretMenuHomeButton.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== fretMenuHomeButton)
                    fretMenuHomeButton.classList.remove("highlight")
                }, 2000)
                break
            }
            fretMenuToggleHomeMenu()
            highlightMenuButton(fretMenuHomeButton)
            break
        default:
            //console.log("Invalid menu command:", menuCommand)
            return false
    }
    return true
}

function fretMenuTogglePlayPause(viaMouse = false) {
    if (!viaMouse && api.playerState != alphaTab.synth.PlayerState.Playing) {
        lookForTimer = true
        closeFretMenu(true)
        startingNote = undefined
    } else {
        lookForTimer = false
    }
    togglePlayPause()
    setTimeout(() => {
        displayStatusMessage(statusMessageFretMenu, "Play/Pause Toggled")
    }, 10)
}

function fretMenuToggleToolsMenu(viaMouse = false) {
    if (toolsSubMenuOpen) {
        closeToolsSubMenu(exitOnSubMenuClose && !viaMouse)
        if (!exitOnSubMenuClose || viaMouse) {
            openFretMenu()
        }
    } else {
        closeFretMenu()
        openToolsSubMenu()
    }
}

function fretMenuStopSong(viaMouse = false) {
    stopSong()
    // if (!viaMouse) {
    //     closeFretMenu();
    // }
    setTimeout(() => {
        displayStatusMessage(statusMessageFretMenu, "Returned to Start")
    }, 10)
}

function fretMenuJumpForward(viaMouse = false) {
    jumpForeward()
    setTimeout(() => {
        displayStatusMessage(statusMessageFretMenu, "Jumped Forward")
    }, 10)
}

function fretMenuJumpBackward(viaMouse = false) {
    jumpBackward()
    setTimeout(() => {
        displayStatusMessage(statusMessageFretMenu, "Jumped Backward")
    }, 10)
}

function fretMenuJumpSectionForward(viaMouse = false) {
    jumpSectionForward()
    // if (!viaMouse) {
    //     closeFretMenu();
    // }
    setTimeout(() => {
        displayStatusMessage(statusMessageFretMenu, "Jumped Section Forward")
    }, 10)
}

function fretMenuJumpSectionBackward(viaMouse = false) {
    jumpSectionBackward()
    // if (!viaMouse) {
    //     closeFretMenu();
    // }
    setTimeout(() => {
        displayStatusMessage(statusMessageFretMenu, "Jumped Section Backward")
    }, 10)
}

function fretMenuToggleLock(viaMouse = false) {
    lockFretMenu()
    if (!viaMouse) {
        closeFretMenu(true)
        startingNote = undefined
    }
    setTimeout(() => {
        displayStatusMessage(statusMessageFretMenu, "Fret Menu Lock Toggled")
    }, 10)
}

function fretMenuToggleRegionMenu(viaMouse = false) {
    if (regionSubMenuOpen) {
        closeRegionSubMenu(exitOnSubMenuClose && !viaMouse)
        if (!exitOnSubMenuClose || viaMouse) {
            openFretMenu()
        }
    } else {
        closeFretMenu()
        openRegionSubMenu()
    }
}

function fretMenuToggleTrackMenu(viaMouse = false) {
    if (trackSubMenuOpen) {
        closeTrackSubMenu(exitOnSubMenuClose && !viaMouse)
        if (!exitOnSubMenuClose || viaMouse) {
            openFretMenu()
        }
    } else {
        closeFretMenu()
        openTrackSubMenu()
    }
}

function _fretMenuOpen(viaMouse = false) {
    openFretMenu(true)
}

function _fretMenuClose(viaMouse = false) {
    closeAllFretMenus()
}

function fretMenuToggleHomeMenu(viaMouse = false) {
    if (homeSubMenuOpen) {
        closeHomeSubMenu(exitOnSubMenuClose && !viaMouse)
        if (!exitOnSubMenuClose || viaMouse) {
            openFretMenu()
        }
    } else {
        closeFretMenu()
        openHomeSubMenu()
    }
}

function highlightMenuButton(button) {
    if (!button) { console.warn('button is undefined'); return }
    button.classList.add("highlight")
    setTimeout(() => {
        button.classList.remove("highlight")
    }, 400)
}

function toggleMenuButtonAsOpen(button) {
    if (!button) { console.warn('button is undefined'); return }
    button.classList.toggle("open")
}

let statusMessageTimeout
function displayStatusMessage(htmlDiv, message) {
    clearTimeout(statusMessageTimeout)
    htmlDiv.innerHTML = message
    if (htmlDiv.style.opacity === "1") {
        statusMessageTimeout = setTimeout(hideMessage, 1000)
        return
    }
    htmlDiv.style.display = "block"
    setTimeout(() => {
        htmlDiv.style.opacity = "1"
    }, 10)
    statusMessageTimeout = setTimeout(hideMessage, 1000)
    function hideMessage() {
        htmlDiv.style.opacity = "0"
        setTimeout(() => {
            if (htmlDiv.style.opacity === "0") {
                htmlDiv.style.display = "none"
            }
        }, 400)
    }
}

function noFretMenuOpen() {
    return !(fretMenuOpen || toolsSubMenuOpen || trackSubMenuOpen || regionSubMenuOpen || homeSubMenuOpen)
}

function closeAllFretMenus() {
    closeFretMenu(true)
    closeToolsSubMenu(true)
    closeTrackSubMenu(true)
    closeRegionSubMenu(true)
    closeHomeSubMenu(true)
}
