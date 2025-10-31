const fretMenuTrackMenuButton_2 = document.getElementById("fretMenuTrackMenuButton_2")
const trackMenuMoveSelectionUpButton = document.getElementById("trackMenuMoveSelectionUpButton")
const trackMenuMoveSelectionDownButton = document.getElementById("trackMenuMoveSelectionDownButton")
const trackMenuSoloSelectedButton = document.getElementById("trackMenuSoloSelectedButton")
const trackMenuMuteSelectedButton = document.getElementById("trackMenuMuteSelectedButton")
const trackMenuMuteAllButton = document.getElementById("trackMenuMuteAllButton")
const statusMessageTrackMenu = document.getElementById("statusMessageTrackMenu")

const trackSubMenu = document.getElementById("trackSubMenu")

//Needs unique function with same name as action
function trackMenuToggleTrackMenu(viaMouse = false) {
    fretMenuToggleTrackMenu(viaMouse)
}

let trackSubMenuOpen = false
function openTrackSubMenu(animation = false) {
    if (trackSubMenuOpen) {
        return
    }
    closeFretMenu()
    trackSubMenuOpen = true
    toggleMenuButtonAsOpen(fretMenuTrackMenuButton_2)
    trackSubMenu.style.display = "flex"
    trackSubMenu.style.animation = null
    if (animation === true && enlargePieMenu === false) {
        trackSubMenu.style.animation = "slideInFromBottom 0.2s ease-out forwards"
    }
    setTimeout(() => {
        displayStatusMessage(statusMessageTrackMenu, "Track Menu Opened")
    }, 10)
}

function closeTrackSubMenu(animation = false) {
    if (!trackSubMenuOpen) {
        return
    }
    trackSubMenuOpen = false
    toggleMenuButtonAsOpen(fretMenuTrackMenuButton_2)
    trackSubMenu.style.animation = null
    if (animation === true) {
        startingNote = undefined
        lastNoteTime = undefined
        clearInterval(timerInterval)
        timerInterval = undefined
        if (enlargePieMenu === true) {
            fretMenu.style.display = "none"
            return
        }
        trackSubMenu.style.animation = "slideOutToBottom 0.2s ease-in forwards"
        // Wait for the animation to finish before hiding the element
        trackSubMenu.addEventListener(
            "animationend",
            () => {
                trackSubMenu.style.display = "none"
            },
            { once: true }
        )
    } else {
        trackSubMenu.style.display = "none"
    }
}

function handleTrackSubMenuCommand(menuCommand, midiNote) {
    if (menuCommand === "undefined" || midiNote === "undefined") {
        return false
    }

    switch (menuCommand) {
        case "trackMenuToggleTrackMenu": 
            if (fretMenuDoubleClickMode && !clickedButtons.includes(fretMenuTrackMenuButton_2)) {
                clickedButtons.push(fretMenuTrackMenuButton_2)
                fretMenuTrackMenuButton_2.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== fretMenuTrackMenuButton_2)
                    fretMenuTrackMenuButton_2.classList.remove("highlight")
                }, 2000)
                break
            }
            fretMenuToggleTrackMenu()
            highlightMenuButton(fretMenuTrackMenuButton)
            highlightMenuButton(fretMenuTrackMenuButton_2)
            break
        case "trackMenuMoveSelectionUp":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(trackMenuMoveSelectionUpButton)) {
                clickedButtons.push(trackMenuMoveSelectionUpButton)
                trackMenuMoveSelectionUpButton.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== trackMenuMoveSelectionUpButton)
                    trackMenuMoveSelectionUpButton.classList.remove("highlight")
                }, 2000)
                break
            }
            trackMenuMoveSelectionUp()
            highlightMenuButton(trackMenuMoveSelectionUpButton)
            break
        case "trackMenuMoveSelectionDown":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(trackMenuMoveSelectionDownButton)) {
                clickedButtons.push(trackMenuMoveSelectionDownButton)
                trackMenuMoveSelectionDownButton.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== trackMenuMoveSelectionDownButton)
                    trackMenuMoveSelectionDownButton.classList.remove("highlight")
                }, 2000)
                break
            }
            trackMenuMoveSelectionDown()
            highlightMenuButton(trackMenuMoveSelectionDownButton)
            break
        case "trackMenuSoloSelected":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(trackMenuSoloSelectedButton)) {
                clickedButtons.push(trackMenuSoloSelectedButton)
                trackMenuSoloSelectedButton.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== trackMenuSoloSelectedButton)
                    trackMenuSoloSelectedButton.classList.remove("highlight")
                }, 2000)
                break
            }
            trackMenuSoloSelected()
            highlightMenuButton(trackMenuSoloSelectedButton)
            break
        case "trackMenuMuteSelected":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(trackMenuMuteSelectedButton)) {
                clickedButtons.push(trackMenuMuteSelectedButton)
                trackMenuMuteSelectedButton.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== trackMenuMuteSelectedButton)
                    trackMenuMuteSelectedButton.classList.remove("highlight")
                }, 2000)
                break
            }
            trackMenuMuteSelected()
            highlightMenuButton(trackMenuMuteSelectedButton)
            break
        case "trackMenuMuteAll":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(trackMenuMuteAllButton)) {
                clickedButtons.push(trackMenuMuteAllButton)
                trackMenuMuteAllButton.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== trackMenuMuteAllButton)
                    trackMenuMuteAllButton.classList.remove("highlight")
                }, 2000)
                break
            }
            trackMenuMuteAll()
            highlightMenuButton(trackMenuMuteAllButton)
            break
        default:
            //console.log("Invalid menu command:", menuCommand);
            return false
    }
    return true
}

function trackMenuSoloSelected(viaMouse = false) {
    const index = soloTrackIndexes.indexOf(currentTrackIndex)
    if (index === -1) {
        soloTrackIndexes.push(currentTrackIndex)
        soloTrack(currentTrackIndex, true)
        setTimeout(() => {
            displayStatusMessage(statusMessageTrackMenu, "Solo Track Selected")
        }, 10)
    } else {
        soloTrackIndexes.splice(index, 1)
        soloTrack(currentTrackIndex, false)
        setTimeout(() => {
            displayStatusMessage(statusMessageTrackMenu, "Solo Track Removed")
        }, 10)
    }
    updateTracksPanel()
}

function trackMenuMuteSelected(viaMouse = false) {
    const index = muteTrackIndexes.indexOf(currentTrackIndex)
    if (index === -1) {
        muteTrackIndexes.push(currentTrackIndex)
        muteTrack(currentTrackIndex, true)
        setTimeout(() => {
            displayStatusMessage(statusMessageTrackMenu, "Track Muted")
        }, 10)
    } else {
        muteTrackIndexes.splice(index, 1)
        muteTrack(currentTrackIndex, false)
        setTimeout(() => {
            displayStatusMessage(statusMessageTrackMenu, "Track Unmuted")
        }, 10)
    }
    updateTracksPanel()
}

function trackMenuMuteAll(viaMouse = false) {
    if (muteTrackIndexes.length === totalTracks) {
        muteTrackIndexes = []
        muteAllTracks(false)
        setTimeout(() => {
            displayStatusMessage(statusMessageTrackMenu, "All Tracks Unmuted")
        }, 10)
    } else {
        muteTrackIndexes = tracks.map((_, index) => index)
        muteAllTracks(true)
        setTimeout(() => {
            displayStatusMessage(statusMessageTrackMenu, "All Tracks Muted")
        }, 10)
    }
    highlightMenuButton(trackMenuMuteAllButton)
    updateTracksPanel()
}

let currentTrackIndex = 0
let tracks = []
let totalTracks = 0
const tracksContainer = document.getElementById("tracks")
let soloTrackIndexes = []
let muteTrackIndexes = []

function initTracksPanel() {
    tracksContainer.innerHTML = ""
    currentTrackIndex = 0
    soloTrackIndexes = []
    muteTrackIndexes = []
    totalTracks = api.score.tracks.length
    tracks = api.score.tracks
    tracks.forEach((track, index) => {
        const trackItem = document.createElement("div")
        trackItem.classList.add("track")
        trackItem.textContent = track.name
        tracksContainer.appendChild(trackItem)
    })
    updateTracksPanel()
}

timeoutId = undefined
function updateTracksPanel() {
    const trackHeight = 64
    const offset = currentTrackIndex * trackHeight
    tracksContainer.style.transform = `translateY(${offset}px)`
    const _tracks = document.querySelectorAll(".track")
    _tracks.forEach((track, index) => {
        track.classList.toggle("active", index === currentTrackIndex)
        track.classList.toggle("solo", soloTrackIndexes.includes(index))
        track.classList.toggle("muted", muteTrackIndexes.includes(index))

        updateSoloIcon(track, soloTrackIndexes.includes(index) === false)
        updateMuteIcon(track, muteTrackIndexes.includes(index) === false)
        // Update again to fix the margin issue
        updateSoloIcon(track, soloTrackIndexes.includes(index) === false)
        updateMuteIcon(track, muteTrackIndexes.includes(index) === false)
    })

    trackMenuSoloSelectedButton?.classList.toggle("active", soloTrackIndexes.includes(currentTrackIndex))
    trackMenuMuteSelectedButton?.classList.toggle("active", muteTrackIndexes.includes(currentTrackIndex))

    if (timeoutId) {
        clearTimeout(timeoutId)
    }
    if (tracks[currentTrackIndex].name !== currentTrack) {
        timeoutId = setTimeout(() => {
            changeTrack(currentTrackIndex)
        }, 500)
    }
}

function trackMenuMoveSelectionUp() {
    if (currentTrackIndex < totalTracks - 1) {
        currentTrackIndex++
    } else {
        currentTrackIndex = 0
    }
    updateTracksPanel()
    setTimeout(() => {
        displayStatusMessage(statusMessageTrackMenu, "Track Selection Moved Up")
    }, 10)
}

function trackMenuMoveSelectionDown() {
    if (currentTrackIndex > 0) {
        currentTrackIndex--
    } else {
        currentTrackIndex = totalTracks - 1
    }
    updateTracksPanel()
    setTimeout(() => {
        displayStatusMessage(statusMessageTrackMenu, "Track Selection Moved Down")
    }, 10)
}

function updateSoloIcon(trackElement, remove = false) {
    if (remove === true) {
        const existingIcon = trackElement.querySelector(".track-solo-icon")
        if (existingIcon) {
            trackElement.removeChild(existingIcon)
        }
    } else {
        const existingIcon = trackElement.querySelector(".track-solo-icon")
        if (existingIcon) {
            // Add margin if mute icon is present
            existingIcon.style.marginLeft = "-240px"
            const muteIcon = trackElement.querySelector(".track-muted-icon")
            if (muteIcon) {
                existingIcon.style.marginLeft = "-335px"
            }
            return
        }
        const soloIcon = document.createElement("img")
        soloIcon.classList.add("track-solo-icon")
        soloIcon.src = "./resources/svg/light/headphones.svg"
        // Add margin if mute icon is present
        soloIcon.style.marginLeft = "-240px"
        const muteIcon = trackElement.querySelector(".track-muted-icon")
        if (muteIcon) {
            soloIcon.style.marginLeft = "-335px"
        }
        trackElement.appendChild(soloIcon)
    }
}

function updateMuteIcon(trackElement, remove = false) {
    if (remove === true) {
        const existingIcon = trackElement.querySelector(".track-muted-icon")
        if (existingIcon) {
            trackElement.removeChild(existingIcon)
        }
    } else {
        const existingIcon = trackElement.querySelector(".track-muted-icon")
        if (existingIcon) {
            existingIcon.style.marginLeft = "-240px"
            return
        }
        const muteIcon = document.createElement("img")
        muteIcon.classList.add("track-muted-icon")
        muteIcon.src = "./resources/svg/light/mute.svg"
        muteIcon.style.marginLeft = "-240px"
        trackElement.appendChild(muteIcon)
    }
}
