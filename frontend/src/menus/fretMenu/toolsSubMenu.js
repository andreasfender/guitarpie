const fretMenuToolsButton_2 = document.getElementById("fretMenuToolsButton_2")
const fretMenuZoomPlusButton = document.getElementById("fretMenuZoomPlusButton")
const fretMenuZoomMinusButton = document.getElementById("fretMenuZoomMinusButton")
const fretMenuCountInButton = document.getElementById("fretMenuCountInButton")
const fretMenuTempoPlusButton = document.getElementById("fretMenuTempoPlusButton")
const fretMenuTempoMinusButton = document.getElementById("fretMenuTempoMinusButton")
const fretMenuVolumePlusButton = document.getElementById("fretMenuVolumePlusButton")
const fretMenuVolumeMinusButton = document.getElementById("fretMenuVolumeMinusButton")
const fretMenuMetronomeButton = document.getElementById("fretMenuMetronomeButton")
const statusMessageToolsMenu = document.getElementById("statusMessageToolsMenu")

const toolsSubMenu = document.getElementById("toolsSubMenu")

//Needs unique function with same name as action
function toolsMenuToggleToolsMenu(viaMouse = false) {
    fretMenuToggleToolsMenu(viaMouse)
}

let toolsSubMenuOpen = false
function openToolsSubMenu(animation = false) {
    if (toolsSubMenuOpen) {
        return
    }
    toolsSubMenuOpen = true
    toggleMenuButtonAsOpen(fretMenuToolsButton_2)
    //console.log(fretMenuToolsButton_2.classList)
    //fretMenuToolsButton_2.classList = []
    toolsSubMenu.style.display = "flex"
    toolsSubMenu.style.animation = null
    if (animation === true && enlargePieMenu === false) {
        toolsSubMenu.style.animation = "slideInFromBottom 0.2s ease-out forwards"
    }
    setTimeout(() => {
        displayStatusMessage(statusMessageToolsMenu, "Tools Menu Opened")
    }, 10)
}

function closeToolsSubMenu(animation = false) {
    if (!toolsSubMenuOpen) {
        return
    }
    toolsSubMenuOpen = false
    toggleMenuButtonAsOpen(fretMenuToolsButton_2)
    toolsSubMenu.style.animation = null
    if (animation === true) {
        startingNote = undefined
        lastNoteTime = undefined
        clearInterval(timerInterval)
        timerInterval = undefined
        if (enlargePieMenu === true) {
            fretMenu.style.display = "none"
            return
        }
        toolsSubMenu.style.animation = "slideOutToBottom 0.2s ease-in forwards"
        // Wait for the animation to finish before hiding the element
        toolsSubMenu.addEventListener(
            "animationend",
            () => {
                toolsSubMenu.style.display = "none"
            },
            { once: true }
        )
    } else {
        toolsSubMenu.style.display = "none"
    }
}

function handleToolsSubMenuCommand(menuCommand, midiNote) {
    if (menuCommand === "undefined" || midiNote === "undefined") {
        return false
    }
    switch (menuCommand) {
        case "toolsMenuToggleToolsMenu":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(fretMenuToolsButton_2)) {
                clickedButtons.push(fretMenuToolsButton_2)
                fretMenuToolsButton_2.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== fretMenuToolsButton_2)
                    fretMenuToolsButton_2.classList.remove("highlight")
                }, 2000)
                break
            }
            fretMenuToggleToolsMenu()
            highlightMenuButton(fretMenuToolsButton)
            highlightMenuButton(fretMenuToolsButton_2)
            break

        case "fretMenuToggleCountIn":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(fretMenuCountInButton)) {
                clickedButtons.push(fretMenuCountInButton)
                fretMenuCountInButton.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== fretMenuCountInButton)
                    fretMenuCountInButton.classList.remove("highlight")
                }, 2000)
                break
            }
            fretMenuToggleCountIn()
            highlightMenuButton(fretMenuCountInButton)
            break
        case "fretMenuToggleMetronome":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(fretMenuMetronomeButton)) {
                clickedButtons.push(fretMenuMetronomeButton)
                fretMenuMetronomeButton.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== fretMenuMetronomeButton)
                    fretMenuMetronomeButton.classList.remove("highlight")
                }, 2000)
                break
            }
            fretMenuToggleMetronome()
            highlightMenuButton(fretMenuMetronomeButton)
            break
        case "fretMenuZoomPlus":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(fretMenuZoomPlusButton)) {
                clickedButtons.push(fretMenuZoomPlusButton)
                fretMenuZoomPlusButton.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== fretMenuZoomPlusButton)
                    fretMenuZoomPlusButton.classList.remove("highlight")
                }, 2000)
                break
            }
            fretMenuZoomPlus()
            highlightMenuButton(fretMenuZoomPlusButton)
            break
        case "fretMenuZoomMinus":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(fretMenuZoomMinusButton)) {
                clickedButtons.push(fretMenuZoomMinusButton)
                fretMenuZoomMinusButton.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== fretMenuZoomMinusButton)
                    fretMenuZoomMinusButton.classList.remove("highlight")
                }, 2000)
                break
            }
            fretMenuZoomMinus()
            highlightMenuButton(fretMenuZoomMinusButton)
            break
        case "fretMenuTempoPlus":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(fretMenuTempoPlusButton)) {
                clickedButtons.push(fretMenuTempoPlusButton)
                fretMenuTempoPlusButton.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== fretMenuTempoPlusButton)
                    fretMenuTempoPlusButton.classList.remove("highlight")
                }, 2000)
                break
            }
            fretMenuTempoPlus()
            highlightMenuButton(fretMenuTempoPlusButton)
            break
        case "fretMenuTempoMinus":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(fretMenuTempoMinusButton)) {
                clickedButtons.push(fretMenuTempoMinusButton)
                fretMenuTempoMinusButton.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== fretMenuTempoMinusButton)
                    fretMenuTempoMinusButton.classList.remove("highlight")
                }, 2000)
                break
            }
            fretMenuTempoMinus()
            highlightMenuButton(fretMenuTempoMinusButton)
            break
        case "fretMenuVolumePlus":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(fretMenuVolumePlusButton)) {
                clickedButtons.push(fretMenuVolumePlusButton)
                fretMenuVolumePlusButton.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== fretMenuVolumePlusButton)
                    fretMenuVolumePlusButton.classList.remove("highlight")
                }, 2000)
                break
            }
            fretMenuVolumePlus()
            highlightMenuButton(fretMenuVolumePlusButton)
            break
        case "fretMenuVolumeMinus":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(fretMenuVolumeMinusButton)) {
                clickedButtons.push(fretMenuVolumeMinusButton)
                fretMenuVolumeMinusButton.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== fretMenuVolumeMinusButton)
                    fretMenuVolumeMinusButton.classList.remove("highlight")
                }, 2000)
                break
            }
            fretMenuVolumeMinus()
            highlightMenuButton(fretMenuVolumeMinusButton)
            break
        default:
            //console.log("Invalid menu command:", menuCommand);
            return false
    }
    return true
}

function fretMenuToggleCountIn(viaMouse = false) {
    toggleCountIn()
    setTimeout(() => {
        displayStatusMessage(statusMessageToolsMenu, "Count In: " + (countInEnabled ? "On" : "Off"))
    }, 10)
}

function fretMenuToggleMetronome(viaMouse = false) {
    toggleMetronome()
    setTimeout(() => {
        displayStatusMessage(statusMessageToolsMenu, "Metronome: " + (metronomeEnabled ? "On" : "Off"))
    }, 10)
}

function fretMenuZoomPlus(viaMouse = false) {
    zoomPlus()
    setTimeout(() => {
        displayStatusMessage(statusMessageToolsMenu, "Zoom: " + parseInt(api.settings.display.scale * 100) + "%")
    }, 10)
}

function fretMenuZoomMinus(viaMouse = false) {
    zoomMinus()
    setTimeout(() => {
        displayStatusMessage(statusMessageToolsMenu, "Zoom: " + parseInt(api.settings.display.scale * 100) + "%")
    }, 10)
}

function fretMenuTempoPlus(viaMouse = false) {
    tempoPlus()
    setTimeout(() => {
        displayStatusMessage(statusMessageToolsMenu, "Tempo: " + Math.round(api.playbackSpeed * 100) + "%")
    }, 10)
}

function fretMenuTempoMinus(viaMouse = false) {
    tempoMinus()
    setTimeout(() => {
        displayStatusMessage(statusMessageToolsMenu, "Tempo: " + Math.round(api.playbackSpeed * 100) + "%")
    }, 10)
}

function fretMenuVolumePlus(viaMouse = false) {
    volumePlus()
    setTimeout(() => {
        displayStatusMessage(statusMessageToolsMenu, "Volume: " + api.masterVolume * 100 + "%")
    }, 10)
}

function fretMenuVolumeMinus(viaMouse = false) {
    volumeMinus()
    setTimeout(() => {
        displayStatusMessage(statusMessageToolsMenu, "Volume: " + api.masterVolume * 100 + "%")
    }, 10)
}
