// Get the dropdown element
const instrumentDropdown = document.querySelector("#instrumentDropdown")

// Variables to hold the state
let currentScore = null

// Control functions for each control in the UI
function updateInstrumentDropdown(score) {
    instrumentDropdown.innerHTML = ""
    score.tracks.forEach((track) => {
        const option = document.createElement("option")
        option.value = track.index
        option.textContent = track.name
        instrumentDropdown.appendChild(option)
    })
}

instrumentDropdown.onchange = (e) => changeTrack(parseInt(e.target.value))

function changeTrack(selectedTrackIndex) {
    if (currentScore) {
        const selectedTrack = currentScore.tracks.find((track) => track.index === selectedTrackIndex)
        if (selectedTrack) {
            webSocketDisconnectedIcon.style.display = "none"
            api.renderTracks([selectedTrack])
            currentTrack = selectedTrack.name
            currentSelectedTrackIndex = selectedTrack.index
        }
    } else {
        console.log("No score is loaded yet.")
    }
}

// ----------------- Player Controls -----------------

const countIn = wrapper.querySelector(".header .at-count-in")
const countInFretMenu = document.getElementById("fretMenuCountInButton")
const countInIndicator = document.getElementById("count-in-indicator")
let countInEnabled = true
countIn.classList.add("active")
countInFretMenu.classList.add("active")
countIn.onclick = toggleCountIn

function toggleCountIn() {
    countIn?.classList.toggle("active")
    countInIndicator.style.display = countIn.classList.contains("active") ? "block" : "none"
    countInFretMenu.classList.toggle("active")
    api.countInVolume = countIn.classList.contains("active") ? 1 : 0
    countInEnabled = countIn.classList.contains("active")
}

const metronome = wrapper.querySelector(".header .at-metronome")
const metronomeFretMenu = document.getElementById("fretMenuMetronomeButton")
const metronomeIndicator = document.getElementById("metronome-indicator")
let metronomeEnabled = false
metronome.onclick = toggleMetronome

function toggleMetronome() {
    metronome.classList.toggle("active")
    metronomeIndicator.style.display = metronome.classList.contains("active") ? "block" : "none"
    metronomeFretMenu.classList.toggle("active")
    api.metronomeVolume = metronome.classList.contains("active") ? 1 : 0
    metronomeEnabled = metronome.classList.contains("active")
}

const loop = wrapper.querySelector(".header .at-loop")
const loopFretMenu = document.getElementById("regionMenuToggleLoopButton")
const loopIndicator = document.getElementById("loop-indicator")
let loopEnabled = false
loop.onclick = toggleLoop

function toggleLoop() {
    loop.classList.toggle("active")
    loopIndicator.style.display = loop.classList.contains("active") ? "block" : "none"
    loopFretMenu.classList.toggle("active")
    api.isLooping = loop.classList.contains("active")
    loopEnabled = loop.classList.contains("active")
}

const staveProfile = document.getElementById("staveProfileDropdown")
staveProfile.onchange = (e) => updateStaveProfile(e.target.selectedIndex - 1)

const viewport = document.getElementById("at-viewport")
function updateStaveProfile(selectedIndex) {
    if (selectedIndex === -1) {
        viewport.style.display = "none"
    } else {
        viewport.style.display = "block"
    }
    api.settings.display.staveProfile = selectedIndex
    api.updateSettings()
    api.render()
}

const rhythmNotation = document.getElementById("rhythmNotationDropdown")
rhythmNotation.onchange = (e) => updateRhythmNotation(e.target.selectedIndex)

function updateRhythmNotation(selectedIndex) {
    api.settings.notation.rhythmMode = selectedIndex
    api.updateSettings()
    api.render()
}

const zoom = document.getElementById("zoomDropdown")
zoom.onchange = (e) => updateZoom(e.target.value)
const zoomIndicator = document.getElementById("zoom-indicator")

function updateZoom(value) {
    zoomIndicator.innerText = `Zoom ${value}%`
    if (parseInt(value) !== 100) {
        zoomIndicator.style.display = "block"
    } else {
        zoomIndicator.style.display = "none"
    }
    const zoomLevel = parseInt(value) / 100
    api.settings.display.scale = zoomLevel
    api.updateSettings()
    api.render()
}

function zoomPlus() {
    const zoomValue = parseInt(api.settings.display.scale * 100 + 10)
    zoomIndicator.innerText = `Zoom ${zoomValue}%`
    if (zoomValue !== 100) {
        zoomIndicator.style.display = "block"
    } else {
        zoomIndicator.style.display = "none"
    }
    if (zoomValue <= 200) {
        api.settings.display.scale = zoomValue / 100
        api.updateSettings()
        api.render()
    }
}

function zoomMinus() {
    const zoomValue = parseInt(api.settings.display.scale * 100 - 10)
    zoomIndicator.innerText = `Zoom ${zoomValue}%`
    if (zoomValue !== 100) {
        zoomIndicator.style.display = "block"
    } else {
        zoomIndicator.style.display = "none"
    }
    if (zoomValue >= 30) {
        api.settings.display.scale = zoomValue / 100
        api.updateSettings()
        api.render()
    }
}

function resetZoom() {
    api.settings.display.scale = 1.0
    zoomIndicator.innerText = `Zoom 100%`
    zoomIndicator.style.display = "none"
    api.updateSettings()
    api.render()
}

const tempoIndicator = document.getElementById("tempo-indicator")

function tempoPlus() {
    let tempoValue = api.playbackSpeed
    if (tempoValue < 2.0) {
        tempoValue += 0.05
        api.playbackSpeed = tempoValue
    }
    tempoIndicator.innerText = `Tempo ${Math.round(tempoValue * 100)}%`
    if (tempoValue !== 1) {
        tempoIndicator.style.display = "block"
    } else {
        tempoIndicator.style.display = "none"
    }
}

function tempoMinus() {
    let tempoValue = api.playbackSpeed
    if (tempoValue > 0.3) {
        tempoValue -= 0.05
        api.playbackSpeed = tempoValue
    }
    tempoIndicator.innerText = `Tempo ${Math.round(tempoValue * 100)}%`
    if (tempoValue !== 1) {
        tempoIndicator.style.display = "block"
    } else {
        tempoIndicator.style.display = "none"
    }
}

function resetTempo() {
    api.playbackSpeed = 1.0
    tempoIndicator.innerText = `Tempo 100%`
    tempoIndicator.style.display = "none"
}

const volumeIndicator = document.getElementById("volume-indicator")

function volumePlus() {
    let volumeValue = api.masterVolume
    if (volumeValue < 6) {
        volumeValue += 0.25
        api.masterVolume = volumeValue
    }
    volumeIndicator.innerText = `Volume ${Math.round(volumeValue * 100)}%`
    if (volumeValue !== 1) {
        volumeIndicator.style.display = "block"
    } else {
        volumeIndicator.style.display = "none"
    }
}

function volumeMinus() {
    let volumeValue = api.masterVolume
    if (volumeValue > 0) {
        volumeValue -= 0.25
        api.masterVolume = volumeValue
    }
    volumeIndicator.innerText = `Volume ${Math.round(volumeValue * 100)}%`
    if (volumeValue !== 1) {
        volumeIndicator.style.display = "block"
    } else {
        volumeIndicator.style.display = "none"
    }
}

function resetVolume() {
    api.masterVolume = 1.0
    volumeIndicator.innerText = `Volume 100%`
    volumeIndicator.style.display = "none"
}

function soloTrack(trackIndex, solo = true) {
    api.changeTrackSolo(tracks[trackIndex], solo)
}

function muteTrack(trackIndex, mute = true) {
    api.changeTrackMute(tracks[trackIndex], mute)
}

function muteAllTracks(mute = true) {
    api.changeTrackMute(tracks, mute)
}

const layout = document.getElementById("layoutDropdown")
layout.onchange = updateLayout

function updateLayout() {
    switch (layout.value) {
        case "horizontal":
            api.settings.display.layoutMode = alphaTab.LayoutMode.Horizontal
            break
        case "page":
            api.settings.display.layoutMode = alphaTab.LayoutMode.Page
            break
    }
    api.updateSettings()
    api.render()
}

const playAndPause = document.getElementById("playPauseButton")
const playAndPauseIcon = document.getElementById("playPauseIcon")
const playAndPauseIconFretMenu = document.getElementById("playPauseIconFretMenu")
playAndPause.onclick = togglePlayPause

function togglePlayPause(e) {
    api.playPause()
}

let currentlyPlaying = false
function updatePlayPauseIcon(isPlaying) {
    try {
        currentlyPlaying = isPlaying
        playAndPauseIcon.src = isPlaying
            ? "./resources/codicons/light/debug-pause.svg"
            : "./resources/codicons/light/play.svg"
        playAndPauseIcon.alt = isPlaying ? "Pause" : "Play"
        playAndPauseIconFretMenu.src = isPlaying
            ? "./resources/codicons/light/debug-pause.svg"
            : "./resources/codicons/light/play.svg"
        playAndPauseIconFretMenu.alt = isPlaying ? "Pause" : "Play"
    } catch (e) {
        console.warn(e)
    }
}

// Watch Play/Pause status and update the icon
api.playerStateChanged.on((e) => {
    updatePlayPauseIcon(e.state === alphaTab.synth.PlayerState.Playing)
})

const stop = wrapper.querySelector(".header .at-player-stop")
stop.onclick = stopSong

function stopSong(e) {
    api.stop()
    setTimeout(() => {
        scrollToBar(getCurrentBarNumber())
    }, 10)
}

function jumpForeward() {
    const currentBarNumber = getCurrentBarNumber()
    if (currentBarNumber === api.score.masterBars.length) return
    scrollToBar(currentBarNumber + 1)
}

function jumpBackward() {
    const currentBarNumber = getCurrentBarNumber()
    if (currentBarNumber === 1) return
    scrollToBar(currentBarNumber - 1)
}

function jumpSectionForward() {
    const currentBarNumber = getCurrentBarNumber()
    let sectionToScrollTo = undefined
    sections.forEach((section) => {
        if (section.barNumbers.includes(currentBarNumber)) {
            const nextSectionIndex = sections.indexOf(section) + 1
            if (nextSectionIndex < sections.length) {
                sectionToScrollTo = sections[nextSectionIndex].sectionName
            }
        }
    })
    if (!sectionToScrollTo) {
        scrollToBar(api.score.masterBars.length)
    } else {
        scrollToSection(sectionToScrollTo)
    }
}

function jumpSectionBackward() {
    const currentBarNumber = getCurrentBarNumber()
    let sectionToScrollTo = undefined
    sections.forEach((section) => {
        if (section.barNumbers.includes(currentBarNumber)) {
            let previousSectionIndex = sections.indexOf(section)
            if (section.barNumbers[0] === currentBarNumber) {
                previousSectionIndex -= 1
            }
            if (previousSectionIndex >= 0) {
                sectionToScrollTo = sections[previousSectionIndex].sectionName
            }
        }
    })
    if (!sectionToScrollTo) return
    scrollToSection(sectionToScrollTo)
}

let regionStartTick = undefined
let regionStartBarNumber = undefined
function setRegionStart(barNumber) {
    const startTick = api.score.masterBars[barNumber - 1].start
    if (regionEndTick === undefined || regionEndTick <= startTick) {
        regionEndTick = startTick + getTickLengthOfOneBar() - 1
        regionEndBarNumber = barNumber
    }
    api.playbackRange = { startTick: startTick, endTick: regionEndTick }
    regionStartTick = startTick
    regionStartBarNumber = barNumber
}

let regionEndTick = undefined
let regionEndBarNumber = undefined
function setRegionEnd(barNumber) {
    const endTick = api.score.masterBars[barNumber - 1].start + getTickLengthOfOneBar() - 1
    if (regionStartTick === undefined || regionStartTick >= endTick) {
        regionStartTick = api.score.masterBars[barNumber - 1].start
        regionStartBarNumber = barNumber
    }
    api.playbackRange = { startTick: regionStartTick, endTick: endTick }
    regionEndTick = endTick
    regionEndBarNumber = barNumber
}

function clearRegion() {
    api.playbackRange = undefined
    regionStartTick = undefined
    regionEndTick = undefined
    regionStartBarNumber = undefined
    regionEndBarNumber = undefined
}

function refreshCurrentRegion() {
    if (regionStartBarNumber !== undefined) {
        setRegionStart(regionStartBarNumber)
    }
    if (regionEndBarNumber !== undefined) {
        setRegionEnd(regionEndBarNumber)
    }
    if (regionStartBarNumber === undefined && regionEndBarNumber === undefined) {
        clearRegion()
    }
}

// ----------------- Song Position Update -----------------

const songPosition = wrapper.querySelector(".at-song-position")

let previousTime = -1

api.playerPositionChanged.on((e) => updateSongPosition(e.currentTime, e.endTime))

function updateSongPosition(currentTime, endTime) {
    const currentSeconds = Math.floor(currentTime / 1000)
    if (currentSeconds === previousTime) return
    previousTime = currentSeconds
    songPosition.innerText = `${formatDuration(currentTime)} / ${formatDuration(endTime)}`
}

function formatDuration(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    seconds = seconds % 60
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}
