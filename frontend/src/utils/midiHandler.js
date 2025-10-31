let startingNote = undefined
const logMidiHandler = false

// REMOVE FROM HERE
// const relativeMap = {
//     9: "fretMenuToggleLock",
//     6: "fretMenuToggleToolsMenu",
//     5: "fretMenuTogglePlayPause",
//     4: "fretMenuStopSong",
//     2: "fretMenuJumpSectionForward",
//     1: "fretMenuJumpForward",
//     0: "fretMenuClose",
//     "-1": "fretMenuJumpBackward",
//     "-2": "fretMenuJumpSectionBackward",
//     "-4": "fretMenuToggleRegionMenu",
//     "-5": "fretMenuToggleHomeMenu",
//     "-6": "fretMenuToggleTrackMenu",
// }

// const regionMenuMap = {
//     1: "regionMenuClearRegion",
//     0: "regionMenuSetRegionEnd",
//     "-1": "regionMenuSetRegionStart",
//     "-4": "fretMenuToggleRegionMenu",
//     "-5": "regionMenuSetSectionAsRegion",
//     "-6": "regionMenuToggleLoop",
// }

// const trackMenuMap = {
//     1: "trackMenuMuteSelected",
//     0: "trackMenuMoveSelectionUp",
//     "-1": "trackMenuSoloSelected",
//     "-4": "trackMenuMuteAll",
//     "-5": "trackMenuMoveSelectionDown",
//     "-6": "fretMenuToggleTrackMenu",
// }

// const toolsMenuMap = {
//     10: "fretMenuToggleCountIn",
//     9: "fretMenuZoomPlus",
//     8: "fretMenuZoomMinus",
//     6: "fretMenuToggleToolsMenu",
//     5: "fretMenuTempoPlus",
//     4: "fretMenuTempoMinus",
//     1: "fretMenuToggleMetronome",
//     0: "fretMenuVolumePlus",
//     "-1": "fretMenuVolumeMinus",
// }

// const homeMenuMap = {
//     "-4": "homeMenuCancel",
//     "-5": "fretMenuToggleHomeMenu",
//     "-6": "homeMenuConfirm",
// }
// TO HERE AFTER REPLACING MAPPING BELOW


// TODO: generate MIDI maps from stored menu
const layouts = getMenuLayouts()
const getMap = (menuId) => {
    const menu = json.filter(menu => menu.id === menuId)[0]
    const centerString = 4
    const centerFret = 3
    const map = new Map()
    for (const option of menu.options) {
        const stringDiff = (option.string - centerString) * 5
        const fretDiff = centerFret - option.fret
        // string 2 is only shifted 4 half-tones
        const midiOffset = - (stringDiff + fretDiff + (option.string === 2 ? 1 : 0))
        map.set(midiOffset, option.action)
    }
    console.log(menuId, map)

    return map
}

const relativeMap = getMap('fretMenu')
const regionMenuMap = getMap('regionSubMenu')
const trackMenuMap = getMap('trackSubMenu')
const toolsMenuMap = getMap('toolsSubMenu')
const homeMenuMap = getMap('homeSubMenu')






let lastNoteTime = undefined
let timerInterval = undefined
let lastCommandTime = 0
let lastCommand = null
const cooldownDuration = 300
let pauseMidiHandler = false

function handleMidiNote(midiNote) {
    console.log('got MIDI note', midiNote)

    if (pauseMidiHandler) {
        if (logMidiHandler) console.log("MIDI handler is paused. Ignoring MIDI note.")
        return
    }

    if (homePageOpen) {
        if (logMidiHandler) console.log("Home page is open.")
        return
    }
    if (midiNote >= 84) {
        if (api.playerState === alphaTab.synth.PlayerState.Playing) {
            if (!pauseOnSilence) {
                api.pause()
            } else {
                stopSong()
                setTimeout(() => {
                    api.play()
                }, 200)
            }
        } else if (fretMenuLocked) {
            unlockFretMenu()
        } else {
            closeAllFretMenus()
        }
        return
    }

    if (api.playerState === alphaTab.synth.PlayerState.Playing) {
        if (logMidiHandler) console.log("Playback is playing. Ignoring MIDI note.")
        return
    }

    if (fretMenuLocked) {
        if (logMidiHandler) console.log("Fret menu is locked.")
        return
    }

    if (startingNote === undefined) {
        if (midiNote >= 53 && midiNote <= 70) {
            startingNote = midiNote
            if (logMidiHandler) console.log(`Set starting note to ${startingNote}`)
            executeCommand("fretMenuOpen", midiNote)
        } else {
            if (logMidiHandler) console.log("Waiting for a valid starting note (53-70)...")
        }
        return
    }

    const offset = midiNote - startingNote
    let command = undefined

    //TODO REPLACE WITH NEW MAPPING
    if (fretMenuOpen === true) {
        command = relativeMap.get(offset)
    } else if (regionSubMenuOpen === true) {
        command = regionMenuMap.get(offset)
    } else if (trackSubMenuOpen === true) {
        command = trackMenuMap.get(offset)
    } else if (toolsSubMenuOpen === true) {
        command = toolsMenuMap.get(offset)
    } else if (homeSubMenuOpen === true) {
        command = homeMenuMap.get(offset)
    }

    if (command) {
        executeCommand(command, midiNote)
    }
}

function executeCommand(command, midiNote) {
    const currentTime = Date.now()

    // Check if the command is a menu toggle and if it's within the cooldown period
    const isCooldownCommand = [
        "fretMenuToggleLock",
        "fretMenuToggleToolsMenu",
        "fretMenuTogglePlayPause",
        "fretMenuToggleTrackMenu",
        "fretMenuToggleRegionMenu",
        "fretMenuToggleHomeMenu",
        "fretMenuToggleCountIn",
        "fretMenuToggleMetronome",
        "trackMenuMuteSelected",
        "trackMenuSoloSelected",
        "regionMenuToggleLoop",
    ].includes(command)

    if (command === "fretMenuClose" && lastCommand === "fretMenuOpen") {
        if (currentTime - lastCommandTime < cooldownDuration) {
            if (logMidiHandler) console.log(`Command "${command}" ignored due to cooldown.`)
            return
        }
    }

    if (command === "fretMenuOpen" && lastCommand === "fretMenuClose") {
        if (currentTime - lastCommandTime < cooldownDuration) {
            if (logMidiHandler) console.log(`Command "${command}" ignored due to cooldown.`)
            startingNote = undefined
            lastNoteTime = undefined
            clearInterval(timerInterval)
            timerInterval = undefined
            if (logMidiHandler) console.log("Resetting starting note and last note time.")
            return
        }
    }

    if (isCooldownCommand && lastCommand === command && currentTime - lastCommandTime < cooldownDuration) {
        if (logMidiHandler) console.log(`Command "${command}" ignored due to cooldown.`)
        return
    }

    lastCommandTime = currentTime
    lastCommand = command
    
    var processed = false
    if (handleFretMenuCommand(command, midiNote))
        processed = true
    else if (handleRegionSubMenuCommand(command, midiNote))
        processed = true
    else if (handleTrackSubMenuCommand(command, midiNote))
        processed = true
    else if (handleToolsSubMenuCommand(command, midiNote))
        processed = true
    else if (handleHomeSubMenuCommand(command, midiNote))
        processed = true

    if (!processed)
        console.log("Invalid menu command:", command)

    // OLD VERSION:
    /*if (regionSubMenuOpen === true) {
        handleRegionSubMenuCommand(command, midiNote);
    } else if (trackSubMenuOpen === true) {
        handleTrackSubMenuCommand(command, midiNote);
    } else if (toolsSubMenuOpen === true) {
        handleToolsSubMenuCommand(command, midiNote);
    } else if (homeSubMenuOpen === true) {
        handleHomeSubMenuCommand(command, midiNote);
    } else {
        if (logMidiHandler) console.log("Executing command:", command);
        handleFretMenuCommand(command, midiNote);
        }
    }*/
}
