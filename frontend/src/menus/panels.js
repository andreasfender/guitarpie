const tabs = document.getElementById("at-viewport")

const header = document.getElementById("header")
const sidebar = document.getElementById("sidebar")
const settingsMenu = document.getElementById("header-settings-menu")
const toggleSidebarButton = document.getElementById("toggleSidebar")
const closeSidebarButton = document.getElementById("closeSidebar")
const toggleSettingsMenuButton = document.getElementById("toggleSettingsMenu")
let isSidebarOpen = false
let isSettingsMenuOpen = false

let homePageOpen = true

// Show header when user moves to the top, unless sidebar or settings menu is open
document.addEventListener("mousemove", (e) => {
    if (isHeaderPinned) {
        header.style.top = "0"
        header.style.opacity = "1"
        return
    }
    if (
        !isSidebarOpen &&
        !isSettingsMenuOpen &&
        e.clientY < 60 &&
        settings.file
    ) {
        header.style.top = "0"
        header.style.opacity = "1"
    } else if (!isSidebarOpen && !isSettingsMenuOpen) {
        header.style.top = "-60px"
        header.style.opacity = "0"
    }
})

// Handle sidebar toggling
toggleSidebarButton.addEventListener("click", () => {
    isSidebarOpen = !isSidebarOpen
    sidebar.classList.toggle("sidebar-open")
    toggleSidebarButton.classList.toggle("sidebar-open")
    if (isSidebarOpen || isSettingsMenuOpen) {
        header.classList.add("sticky")
    } else {
        header.classList.remove("sticky")
    }
})

// Handle sidebar closing
closeSidebarButton.addEventListener("click", (e) => {
    isSidebarOpen = false
    closeAllPanels()
})

// Handle settings menu toggling
toggleSettingsMenuButton.addEventListener("click", () => {
    isSettingsMenuOpen = !isSettingsMenuOpen
    settingsMenu.classList.toggle("settings-menu-open")
    toggleSettingsMenuButton.classList.toggle("settings-menu-open")
    if (isSettingsMenuOpen || isSidebarOpen) {
        header.classList.add("sticky")
    } else {
        header.classList.remove("sticky")
    }
})

// Close panels when clicked anywhere on the page
document.addEventListener("click", (e) => {
    const isHeader = header.contains(e.target)
    const isSidebar = sidebar.contains(e.target)
    const isSettingsMenu = settingsMenu.contains(e.target)
    if (!isHeader && !isSidebar && !isSettingsMenu) {
        closeAllPanels()
        if (
            !fretMenu.contains(e.target) &&
            !toolsSubMenu.contains(e.target) &&
            !trackSubMenu.contains(e.target) &&
            !regionSubMenu.contains(e.target) &&
            !homeSubMenu.contains(e.target)
        ) {
            closeAllFretMenus()
        }
    }
})

// Home Button
const home = document.querySelector(".at-home")
home.onclick = openHomePage

function openHomePage() {
    //window.location.href = "http://localhost:8000/frontend"
    
    var l = window.location.href.indexOf('?')
    if (l > 0)
        window.location.href = window.location.href.substring(0, l)

    //window.location.href = "/frontend"
    api.pause()
    lookForTimer = false
    startingNote = undefined
    overlay.style.display = "none"
    content.style.display = "none"
    startContent.style.display = "flex"
    settings.file = undefined
    closeAllPanels()
    closeAllFretMenus()
    currentlyPreProcessedTrack = undefined
    unpinHeader()
    displaySidebarSongList()
    hideFloatingButtonsAndStatus()
    homePageOpen = true
}

// Close all panels
function closeAllPanels() {
    sidebar.classList.remove("sidebar-open")
    toggleSidebarButton.classList.remove("sidebar-open")
    settingsMenu.classList.remove("settings-menu-open")
    toggleSettingsMenuButton.classList.remove("settings-menu-open")

    if (!isHeaderPinned) {
        header.classList.remove("sticky")
        header.style.top = "-60px"
    }

    isSidebarOpen = false
    isSettingsMenuOpen = false
}

function hideFloatingButtonsAndStatus() {
    countInIndicator.style.display = "none"
    metronomeIndicator.style.display = "none"
    loopIndicator.style.display = "none"
    zoomIndicator.style.display = "none"
    tempoIndicator.style.display = "none"
    volumeIndicator.style.display = "none"
}

function showFloatingButtonsAndStatus() {
    if (countInEnabled) {
        countInIndicator.style.display = "block"
    }
    if (metronomeEnabled) {
        metronomeIndicator.style.display = "block"
    }
    if (loopEnabled) {
        loopIndicator.style.display = "block"
    }
    if (api.settings.display.scale !== 1) {
        zoomIndicator.style.display = "block"
    }
    if (api.playbackSpeed !== 1) {
        tempoIndicator.style.display = "block"
    }
    if (api.masterVolume !== 1) {
        volumeIndicator.style.display = "block"
    }
}
