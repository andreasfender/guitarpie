const buttonCode = new Map([
    // main menu
    ['fretMenuClose', {
        label: 'close menu',
        code: `
                <div class="fret-marker" onclick="_fretMenuClose(true)" id="fretMenuCloseButton" title="Close Fret Menu">
                    <img src="./resources/codicons/light/close.svg" alt="Close Fret Menu" class="fret-menu-icon" />
                </div>
                `}],
    ['fretMenuToggleLock', {
        label: 'lock menu',
        code: `
                <div class="fret-marker" onclick="fretMenuToggleLock(true)" id="fretMenuLockButton" title="Toggle Lock">
                    <img src="./resources/codicons/light/unlock.svg" alt="Toggle Lock" class="fret-menu-icon" id="fretMenuLockIcon" />
                </div>
                `}],
    ['fretMenuStopSong', {
        label: 'stop and back to start',
        code: `
                <div class="fret-marker" onclick="fretMenuStopSong(true)" id="fretMenuStopButton" title="Back to Start">
                    <img src="./resources/codicons/light/debug-reverse-continue.svg" alt="Back to Start" class="fret-menu-icon" />
                </div>
                `}],
    ['fretMenuTogglePlayPause', {
        label: 'play/pause',
        code: `
                <div class="fret-marker" onclick="fretMenuTogglePlayPause(true)" id="fretMenuPlayPauseButton" title="Play/Pause">
                    <img src="./resources/codicons/light/play.svg" alt="Play/Pause" class="fret-menu-icon" id="playPauseIconFretMenu" />
                </div>
                `}],
    ['fretMenuJumpSectionBackward', {
        label: 'one section back',
        code: `
                <div class="fret-marker" onclick="fretMenuJumpSectionBackward(true)" id="fretMenuJumpSectionBackwardButton" title="Jump Section Backward">
                    <img src="./resources/codicons/light/arrow-left.svg" alt="Jump Section Backward" class="fret-menu-icon" />
                </div>
                `}],
    ['fretMenuJumpSectionForward', {
        label: 'one section forward',
        code: `
                <div class="fret-marker" onclick="fretMenuJumpSectionForward(true)" id="fretMenuJumpSectionForwardButton" title="Jump Section Forward">
                    <img src="./resources/codicons/light/arrow-right.svg" alt="Jump Section Forward" class="fret-menu-icon" />
                </div>
                `}],
    ['fretMenuJumpBackward', {
        label: 'one bar back',
        code: `
                <div class="fret-marker" onclick="fretMenuJumpBackward(true)" id="fretMenuJumpBackwardButton" title="Jump Backward">
                    <img src="./resources/codicons/light/chevron-left.svg" alt="Jump Backward" class="fret-menu-icon" />
                </div>
                `}],
    ['fretMenuJumpForward', {
        label: 'one bar forward',
        code: `
                <div class="fret-marker" onclick="fretMenuJumpForward(true)" id="fretMenuJumpForwardButton" title="Jump Forward">
                    <img src="./resources/codicons/light/chevron-right.svg" alt="Jump Forward" class="fret-menu-icon" />
                </div>
                `}],

    ['fretMenuToggleToolsMenu', {
        label: 'open tools menu',
        code: `
                <div class="fret-marker" onclick="fretMenuToggleToolsMenu(true)" id="fretMenuToolsButton" title="Toggle Tool Menu">
                    <img src="./resources/codicons/light/tools.svg" alt="Toggle Tool Menu" class="fret-menu-icon" />
                </div>
                `}],
    ['fretMenuToggleTrackMenu', {
        label: 'open track menu',
        code: `
                 <div class="fret-marker" onclick="fretMenuToggleTrackMenu(true)" id="fretMenuTrackMenuButton" title="Toggle Track Menu">
                    <img src="./resources/svg/light/guitar.svg" alt="Toggle Track Menu" class="fret-menu-icon" />
                </div>
                `}],
    ['fretMenuToggleHomeMenu', {
        label: 'open home menu',
        code: `
                <div class="fret-marker" onclick="fretMenuToggleHomeMenu(true)" id="fretMenuHomeButton" title="Home Button">
                    <img src="./resources/codicons/light/home.svg" alt="Home Button" class="fret-menu-icon" />
                </div>
                `}],
    ['fretMenuToggleRegionMenu', {
        label: 'open region menu',
        code: `
                <div class="fret-marker" onclick="fretMenuToggleRegionMenu(true)" id="fretMenuRegionMenuButton" title="Toggle Region Menu">
                    <img src="./resources/svg/light/bracket.svg" alt="Toggle Region Menu" class="fret-menu-icon" />
                </div>
                `}],

    // home menu
    ['homeMenuConfirm', {
        label: 'confirm going home',
        code: `
                <div class="fret-marker" onclick="homeMenuConfirm(true)" id="homeMenuConfirmButton" title="Confirm">
                    <img src="./resources/svg/light/check.svg" alt="Confirm" class="fret-menu-icon" />
                </div>
                `}],
    ['homeMenuToggleHomeMenu', {
        label: 'return to song selection',
        code: `
                <div
                    class="fret-marker"
                    onclick="homeMenuToggleHomeMenu(true)"
                    id="fretMenuHomeButton_2"
                    title="Home Button"
                >
                    <img src="./resources/codicons/light/home.svg" alt="Home Button" class="fret-menu-icon" />
                </div>
                `}],
    ['homeMenuCancel', {
        label: 'cancel home menu',
        code: `
                <div class="fret-marker" onclick="homeMenuCancel(true)" id="homeMenuCancelButton" title="Cancel">
                    <img src="./resources/svg/light/cancel.svg" alt="Cancel" class="fret-menu-icon" />
                </div>`}],

    // regionselect menu
    ['regionMenuToggleLoop', {
        label: 'toggle looping',
        code: `
                <div
                    class="fret-marker toggle-button"
                    onclick="regionMenuToggleLoop(true)"
                    id="regionMenuToggleLoopButton"
                    title="Toggle Loop"
                >
                    <img src="./resources/codicons/light/debug-restart.svg" alt="Toggle Loop" class="fret-menu-icon" />
                </div>`}],
    ['regionMenuSetRegionStart', {
        label: 'set region start',
        code: `
                <div
                    class="fret-marker"
                    onclick="regionMenuSetRegionStart(true)"
                    id="regionMenuSetRegionStartButton"
                    title="Set Region Start"
                >
                    <img src="./resources/svg/light/bracket-square.svg" alt="Set Region Start" class="fret-menu-icon" />
                </div>`}],
    ['regionMenuSetRegionEnd', {
        label: 'set region end',
        code: `
                <div
                    class="fret-marker"
                    onclick="regionMenuSetRegionEnd(true)"
                    id="regionMenuSetRegionEndButton"
                    title="Set Region End"
                >
                    <img src="./resources/svg/light/bracket-square-right.svg" alt="Set Region End" class="fret-menu-icon" />
                </div>`}],
    ['regionMenuClearRegion', {
        label: 'clear region',
        code: `
                <div
                    class="fret-marker"
                    onclick="regionMenuClearRegion(true)"
                    id="regionMenuClearRegionButton"
                    title="Clear Region"
                >
                    <img src="./resources/svg/light/empty-set.svg" alt="Clear Region" class="fret-menu-icon" />
                </div>`}],
    ['regionMenuSetSectionAsRegion', {
        label: 'set section as region',
        code: `
                <div
                    class="fret-marker"
                    onclick="regionMenuSetSectionAsRegion(true)"
                    id="regionMenuSetSectionAsRegionButton"
                    title="Set Section as Region"
                >
                    <img src="./resources/codicons/light/paintcan.svg" alt="Set Section as Region" class="fret-menu-icon" />
                </div>`}],
    ['regionMenuToggleRegionMenu', {
        label: 'close region menu',
        code: `
                <div
                    class="fret-marker"
                    onclick="regionMenuToggleRegionMenu(true)"
                    id="fretMenuRegionMenuButton_2"
                    title="Toggle Region Menu"
                >
                    <img src="./resources/svg/light/bracket.svg" alt="Toggle Region Menu" class="fret-menu-icon" />
                </div>`}],

    // tools menu
    // TODO rename prefixes to toolsMenu
    ['fretMenuZoomMinus', {
        label: 'zoom out',
        code: `
                <div class="fret-marker" onclick="fretMenuZoomMinus(true)" id="fretMenuZoomMinusButton" title="Zoom Out">
                    <img src="./resources/svg/light/zoom-minus.svg" alt="Zoom Out" class="fret-menu-icon" />
                </div>`}],
    ['fretMenuZoomPlus', {
        label: 'zoom in',
        code: `
                <div class="fret-marker" onclick="fretMenuZoomPlus(true)" id="fretMenuZoomPlusButton" title="Zoom In">
                    <img src="./resources/svg/light/zoom-plus.svg" alt="Zoom In" class="fret-menu-icon" />
                </div>`}],
    ['fretMenuTempoMinus', {
        label: 'decrease tempo',
        code: `
                <div class="fret-marker" onclick="fretMenuTempoMinus(true)" id="fretMenuTempoMinusButton" title="Tempo Down">
                    <img src="./resources/svg/light/music-note-minus.svg" alt="Tempo Down" class="fret-menu-icon" />
                </div>`}],
    ['fretMenuTempoPlus', {
        label: 'increase tempo',
        code: `
                <div class="fret-marker" onclick="fretMenuTempoPlus(true)" id="fretMenuTempoPlusButton" title="Tempo Up">
                    <img src="./resources/svg/light/music-note-plus.svg" alt="Tempo Up" class="fret-menu-icon" />
                </div>`}],
    ['toolsMenuToggleToolsMenu', {
        label: 'close tools menu',
        code: `
                <div class="fret-marker" onclick="toolsMenuToggleToolsMenu(true)" id="fretMenuToolsButton_2" title="Toggle Tool Menu">
                    <img src="./resources/codicons/light/tools.svg" alt="Toggle Tool Menu" class="fret-menu-icon" />
                </div>`}],
    ['fretMenuVolumeMinus', {
        label: 'volume down',
        code: `
                <div class="fret-marker" onclick="fretMenuVolumeMinus(true)" id="fretMenuVolumeMinusButton" title="Volume Down">
                    <img src="./resources/svg/light/volume-low.svg" alt="Volume Down" class="fret-menu-icon" style="width: 25px" />
                </div>`}],
    ['fretMenuVolumePlus', {
        label: 'volume up',
        code: `
                <div class="fret-marker" onclick="fretMenuVolumePlus(true)" id="fretMenuVolumePlusButton" title="Volume Up">
                    <img src="./resources/svg/light/volume-high.svg" alt="Volume Up" class="fret-menu-icon" style="width: 25px" />
                </div>`}],
    ['fretMenuToggleCountIn', {
        label: 'toggle count-in',
        code: `
                <div class="fret-marker toggle-button" onclick="fretMenuToggleCountIn(true)" id="fretMenuCountInButton" title="Toggle Count In">
                    <img src="./resources/svg/light/count.svg" alt="Toggle Count In" class="fret-menu-icon" />
                </div>`}],
    ['fretMenuToggleMetronome', {
        label: 'toggle metronome',
        code: `
                <div class="fret-marker toggle-button" onclick="fretMenuToggleMetronome(true)" id="fretMenuMetronomeButton" title="Toggle Metronome">
                    <img src="./resources/svg/light/metronome.svg" alt="Toggle Metronome" class="fret-menu-icon" />
                </div>`}],

    // track menu
    ['trackMenuMoveSelectionUp', {
        label: 'one track up',
        code: `
                <div class="fret-marker" onclick="trackMenuMoveSelectionUp()" id="trackMenuMoveSelectionUpButton" title="Move Selection Up">
                    <img src="./resources/codicons/light/triangle-up.svg" alt="Move Selection Up" class="fret-menu-icon" />
                </div>`}],
    ['trackMenuMoveSelectionDown', {
        label: 'one track down',
        code: `
                <div class="fret-marker" onclick="trackMenuMoveSelectionDown()" id="trackMenuMoveSelectionDownButton" title="Move Selection Down">
                    <img src="./resources/codicons/light/triangle-down.svg" alt="Move Selection Down"
                        class="fret-menu-icon" />
                </div>`}],
    ['trackMenuSoloSelected', {
        label: 'make track solo',
        code: `
                <div class="fret-marker toggle-button" onclick="trackMenuSoloSelected(true)" id="trackMenuSoloSelectedButton" title="Solo Selected Track">
                    <img src="./resources/svg/light/headphones.svg" alt="Solo Selected Track" class="fret-menu-icon" />
                </div>`}],
    ['trackMenuMuteSelected', {
        label: 'mute track',
        code: `
                <div class="fret-marker toggle-button" onclick="trackMenuMuteSelected(true)" id="trackMenuMuteSelectedButton" title="Mute Selected Track">
                    <img src="./resources/svg/light/mute.svg" alt="Mute Selected Track" class="fret-menu-icon" />
                </div>`}],
    ['trackMenuMuteAll', {
        label: 'mute all tracks',
        code: `
                <div class="fret-marker" onclick="trackMenuMuteAll(true)" id="trackMenuMuteAllButton" title="Mute All Tracks">
                    <img src="./resources/svg/light/mute-all.svg" alt="Mute All Tracks" class="fret-menu-icon" />
                </div>`}],
    ['trackMenuToggleTrackMenu', {
        label: 'close track menu',
        code: `
                <div class="fret-marker" onclick="trackMenuToggleTrackMenu(true)" id="fretMenuTrackMenuButton_2" title="Toggle Track Menu">
                    <img src="./resources/svg/light/guitar.svg" alt="Toggle Track Menu" class="fret-menu-icon" />
                </div>`}],
])


function getMenuLayouts() {
    const stored = localStorage.getItem('menuLayout')
    json = JSON.parse(stored)
    console.log('got menuLayout from localStorage', json)
    return json
}


/**
 * Updates a button in the menu layout saved in localStorage
 */
function updateButton(menuId, actionName, string, fret) {
    console.log('update button')
    string = +string
    fret = +fret

    console.log({ menuId, actionName, newString: string, newFret: fret })

    // update stored layout
    const json = getMenuLayouts()
    if (json) {
        const unusedMenu = json.filter(menu => menu.id === 'unusedOptions')[0]
        const menu = json.filter(menu => menu.id === menuId)[0]
        const menuOptions = menu.options
        if (actionName === null) {
            // remove option
            console.log('removing option', actionName)
            const option = menuOptions.filter(option => option.string === string && option.fret === fret)[0]
            // workaround: add all unused options to a unusedMenu that is never shown...
            // this makes sure all HTML elements are there for the rest of the code
            unusedMenu.options.push(option)
            menu.options = menuOptions.filter(option => option.string !== string || option.fret !== fret)
            console.log('removed option', { string, fret })
        } else {
            let option = menuOptions.filter(option => option.action === actionName)[0]
            // new option
            if (!option) {
                console.log('adding option', actionName)
                // remove option from all other menus
                unusedMenu.options = unusedMenu.options.filter(option => option.action !== actionName)
                for (const me of json) {
                    me.options = me.options.filter(option => option.string !== string || option.fret !== fret)
                }
                option = {
                    action: actionName
                }
                menu.options.push(option)
                console.log('added option', option, string, fret)
            }
            // only update
            console.log('moving option', actionName)
            option.string = string
            option.fret = fret
            console.log('updated option', option)

        }
        console.log('updated menuLayout', json)
        localStorage.setItem('menuLayout', JSON.stringify(json))
    } else {
        console.error('no menu layout saved in localStorage, cannot update it')
    }

    // reload page
    setTimeout(() => {
        openFretMenu()
        // localStorage.setItem('menuOpen', 'true')
        location.reload()
    }, 10)
}

function preventContextMenu(e) {
    e.preventDefault()
    console.log('prevented right click on menu')
}


/**
 * shows menu to edit button
 * @param {*} e
 * @param {*} menuId
 * @param {*} string
 * @param {*} fret
 * @returns
 */
function editButton(e, menuId, string, fret, action) {
    console.log({ e, menuId, string, fret, action })
    e.preventDefault()
    e.stopPropagation()
    const x = e.clientX
    const y = e.clientY

    const oldMenu = document.querySelector('#menuLayoutEditMenu')
    if (oldMenu) {
        document.body.removeChild(oldMenu)
    }

    const background = document.createElement('div')
    background.id = 'menuLayoutEditFadeBackground'
    background.addEventListener('click', () => {
        console.log('bg clicked')
        e.stopPropagation()
        e.preventDefault()
        document.body.removeChild(background)
        document.body.removeChild(menu)
        window.setTimeout(openFretMenu, 10)
    }, false)
    background.addEventListener('contextmenu', preventContextMenu, false)
    document.body.appendChild(background)

    const height = 320
    const width = 200
    const menu = document.createElement('div')
    menu.id = 'menuLayoutEditMenu'
    menu.style = `position: absolute;
                  left: ${x - width / 2}px;
                  top: ${y - height}px;
                  width: ${width}px;
                  height: ${height}px;`

    // menu.textContent = `Change option for ${menuId} at string ${string} fret ${fret}`
    // menu.textContent = `Change option`

    if (action !== 'empty') {
        // remove button
        const removeButton = document.createElement('button')
        removeButton.textContent = 'remove this option'
        // string and fret null => not shown
        removeButton.addEventListener('click', (e) => {
            e.stopPropagation()
            e.preventDefault()
            document.body.removeChild(background)
            document.body.removeChild(menu)
            updateButton(menuId, null, string, fret)
        }, false)
        menu.appendChild(removeButton)
    }

    // label
    const explainer = document.createElement('div')
    explainer.innerText = "choose an option below for this position"
    menu.appendChild(explainer)

    const div = document.createElement('div')
    div.className = 'buttonContainer'
    // buttons for actions
    for (const [action, actionObject] of buttonCode.entries()) {
        const button = document.createElement('button')
        button.textContent = actionObject.label
        button.addEventListener('click', () => {
            e.stopPropagation()
            e.preventDefault()
            document.body.removeChild(background)
            document.body.removeChild(menu)
            updateButton(menuId, action, string, fret)
        }, false)
        div.appendChild(button)
    }
    menu.appendChild(div)

    document.body.appendChild(menu)

    return false
}


/**
 * creates menus from layouts stored in json (either default or from localStorage)
 * @param {*} json
 */
async function createMenus(json) {
    // if in local storage, take that one
    const stored = localStorage.getItem('menuLayout')
    if (stored && stored !== 'undefined') {
        json = JSON.parse(stored)
        console.log('got menuLayout from localStorage', json)
    } else {
        console.log('got menuLayout from server', json)
        localStorage.setItem('menuLayout', JSON.stringify(json))
    }

    // generate each menu
    for (const menu of json) {
        // console.log(menu.id);

        // allow mirroring strings
        const mirroredStrings = localStorage.getItem('menuMirrored') === 'true'

        // transform sparse menu definition to a string x fret matrix (6 x 5)
        const stringFretMatrix = Array.from({ length: 5 }).fill(null).map(() => Array.from({ length: 5 }).fill(null))
        for (const o of menu.options) {
            // do not create removed buttons
            if (o.string === null) { continue }
            if (!mirroredStrings) {
                stringFretMatrix[o.string - 1][o.fret - 1] = o
            } else {
                stringFretMatrix[6 - o.string][o.fret - 1] = o
            }
        }

        // generate menu from JSON config and a lookup for each button's code etc
        let html = `<div class="fretmenu" id="${menu.id}">\n`
        for (const [stringIndex, string] of stringFretMatrix.entries()) {
            html += `\n<div class="string">`
            for (const [fretIndex, option] of string.entries()) {

                if (option !== null && !option.removed) {
                    // console.log('adding ', option.action);
                    if (!buttonCode.has(option.action)) {
                        console.error(`invalid button action ${option.action} in option, data:`, option, menu)
                    }
                    html += `
                        <div
                            class="fret ${menu.id}Fret"
                            data-string="${stringIndex + 1}"
                            data-fret="${fretIndex + 1}"
                            data-option="${option.action}"
                        >
                            ${buttonCode.get(option.action).code}
                        </div>`
                } else if (stringIndex > 0) {
                    html += `
                        <div
                            class="fret ${menu.id}Fret unused"
                            data-string="${stringIndex + 1}"
                            data-fret="${fretIndex + 1}"
                            data-option="empty"
                            title="right click to edit"
                        >
                        </div>`
                } else {
                    html += `
                        <div class="fret">
                        </div>`
                }
            }
            html += `\n</div>\n`
        }

        // E string always emtpy, would break layout
        html += `\n<div class="string"></div>`
        // track menu has additional div for tracks
        if (menu.id === 'trackSubMenu') {
            html += `<div class="tracks-panel" id="tracksPanel">
                <div class="tracks" id="tracks"></div>
                        </div>`
        }
        html += `<div class="status-message" id="${menu.status}"></div>`
        html += `</div>`

        // console.log(html)

        // add menu to page
        document.getElementById(`${menu.id}Container`).innerHTML = html

        // attach onlick for changing buttons
        const frets = document.querySelectorAll(`.${menu.id}Fret`)
        for (const f of frets) {
            f.addEventListener('contextmenu', (e) => {
                e.preventDefault()
                e.stopPropagation()
                const string = f.getAttribute('data-string')
                const fret = f.getAttribute('data-fret')
                const action = f.getAttribute('data-option')
                editButton(e, menu.id, string, fret, action)
            }, false)
        }


    }

    // suppress right click on other parts of menu
    const menus = document.querySelectorAll(`.fretmenu`)
    for (const m of menus) {
        m.addEventListener('contextmenu', preventContextMenu, false)
    }
}


const delay = ms => new Promise(res => setTimeout(res, ms))


async function init() {
    const res = await fetch("./menuLayouts.json")
    const json = await res.json()
    await createMenus(json)

    // await delay(50)

    const scripts = [
        "./src/utils/alphaTab.js",
        "./src/utils/songControls.js",
        "./src/utils/songList.js",
        "./src/utils/songUtils.js",
        "./src/utils/midiHandler.js",
        "./src/menus/settingsMenu.js",
        "./src/menus/fretMenu/fretMenu.js",
        "./src/menus/fretMenu/toolsSubMenu.js",
        "./src/menus/fretMenu/trackSubMenu.js",
        "./src/menus/fretMenu/regionSubMenu.js",
        "./src/menus/fretMenu/homeSubMenu.js",
        "./src/menus/panels.js",
        "./src/connection/songData.js",
        "./src/connection/websocket.js",
    ]

    const scriptPromises = scripts.map((src) => {
        return new Promise(async (resolve, reject) => {
            const script = document.createElement("script")
            script.src = src
            script.defer = true
            script.onload = resolve
            script.onerror = reject
            document.head.appendChild(script)
            // await delay(100)
        })
    })
    await Promise.all(scriptPromises)
    // await delay(10)
    initializeApp()
}
init()


async function initializeApp() {
    await fetchFavoriteSongs().then(() => {
        displaySongLists()
    })
    restartWebSockets()

    // attach functions to settings menu
    function toggleMirroring() {
        const current = localStorage.getItem('menuMirrored') === 'true'
        localStorage.setItem('menuMirrored', current ? 'false' : 'true')
        // alert('Please reload the page to apply the change')
        location.reload()
    }
    const mirrorFretMenuButton = document.getElementById("mirrorFretMenuButton")
    mirrorFretMenuButton.onclick = toggleMirroring

    function resetMenuLayout() {
        if (confirm('are you sure you want to reset all menu customization?')) {
            // const menuOpen = localStorage.getItem('menuOpen')
            localStorage.removeItem('menuLayout')
            // localStorage.setItem('menuOpen', menuOpen)
            // alert('Please reload the page to apply the change')
            location.reload()
        }
    }
    const resetFretMenuButton = document.getElementById("resetFretMenuButton")
    resetFretMenuButton.onclick = resetMenuLayout


    function exportMenuLayout() {
        const json = getMenuLayouts()
        const data = new Blob([JSON.stringify(json, undefined, 4)], { type: 'text/plain' })
        const url = URL.createObjectURL(data)
        const link = document.createElement('a')
        link.href = url
        link.download = 'pie-menu-layout.json'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
    const exportFretMenuButton = document.getElementById("exportFretMenuButton")
    exportFretMenuButton.onclick = exportMenuLayout



    async function importMenuLayout(e) {
        const f = e.target.files[0]
        const text = await f.text()
        // make sure it parses
        JSON.parse(text)
        localStorage.setItem('menuLayout', text)
        location.reload()
    }
    const fileInput = document.getElementById("layoutFileInput")
    fileInput.oninput = importMenuLayout
    const importFretMenuButton = document.getElementById("importFretMenuButton")
    importFretMenuButton.onclick = () => fileInput.click()



    // load song specified in URL
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const song = urlParams.get('song')
    // console.log('loading song', song);
    if (song && song !== 'null') {
        loadSong(song)
        if (localStorage.getItem('menuOpen') === 'true') {
            openFretMenu()
        }
    }

}
