const homeMenuConfirmButton = document.getElementById("homeMenuConfirmButton")
const homeMenuCancelButton = document.getElementById("homeMenuCancelButton")
const fretMenuHomeButton_2 = document.getElementById("fretMenuHomeButton_2")
const statusMessageHomeMenu = document.getElementById("statusMessageHomeMenu")

const homeSubMenu = document.getElementById("homeSubMenu")

//Needs unique function with same name as action
function homeMenuToggleHomeMenu(viaMouse = false) {
    fretMenuToggleHomeMenu(viaMouse)
}

let homeSubMenuOpen = false
function openHomeSubMenu(animation = false) {
    if (homeSubMenuOpen) {
        return
    }
    closeFretMenu()
    homeSubMenuOpen = true
    toggleMenuButtonAsOpen(fretMenuHomeButton_2)
    homeSubMenu.style.display = "flex"
    homeSubMenu.style.animation = null
    if (animation === true && enlargePieMenu === false) {
        homeSubMenu.style.animation = "slideInFromBottom 0.2s ease-out forwards"
    }
    setTimeout(() => {
        displayStatusMessage(statusMessageHomeMenu, "Home Menu Opened")
    }, 10)
}

function closeHomeSubMenu(animation = false) {
    if (!homeSubMenuOpen) {
        return
    }
    homeSubMenuOpen = false
    if (fretMenuHomeButton_2) {
        toggleMenuButtonAsOpen(fretMenuHomeButton_2)
    }
    homeSubMenu.style.animation = null
    if (animation === true) {
        startingNote = undefined
        lastNoteTime = undefined
        clearInterval(timerInterval)
        timerInterval = undefined
        if (enlargePieMenu === true) {
            fretMenu.style.display = "none"
            return
        }
        homeSubMenu.style.animation = "slideOutToBottom 0.2s ease-in forwards"
        // Wait for the animation to finish before hiding the element
        homeSubMenu.addEventListener(
            "animationend",
            () => {
                homeSubMenu.style.display = "none"
            },
            { once: true }
        )
    } else {
        homeSubMenu.style.display = "none"
    }
}

function handleHomeSubMenuCommand(menuCommand, midiNote) {
    if (menuCommand === "undefined" || midiNote === "undefined") {
        return false
    }

    switch (menuCommand) {
        case "homeMenuToggleHomeMenu":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(fretMenuHomeButton_2)) {
                clickedButtons.push(fretMenuHomeButton_2)
                fretMenuHomeButton_2.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== fretMenuHomeButton_2)
                    fretMenuHomeButton_2.classList.remove("highlight")
                }, 2000)
                break
            }
            fretMenuToggleHomeMenu()
            highlightMenuButton(fretMenuHomeButton)
            highlightMenuButton(fretMenuHomeButton_2)
            break
        case "homeMenuConfirm":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(homeMenuConfirmButton)) {
                clickedButtons.push(homeMenuConfirmButton)
                homeMenuConfirmButton.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== homeMenuConfirmButton)
                    homeMenuConfirmButton.classList.remove("highlight")
                }, 2000)
                break
            }
            homeMenuConfirm()
            highlightMenuButton(homeMenuConfirmButton)
            break
        case "homeMenuCancel":
            if (fretMenuDoubleClickMode && !clickedButtons.includes(homeMenuCancelButton)) {
                clickedButtons.push(homeMenuCancelButton)
                homeMenuCancelButton.classList.add("highlight")
                setTimeout(() => {
                    clickedButtons = clickedButtons.filter((button) => button !== homeMenuCancelButton)
                    homeMenuCancelButton.classList.remove("highlight")
                }, 2000)
                break
            }
            homeMenuCancel()
            highlightMenuButton(homeMenuCancelButton)
            break
        default:
            //console.log("Invalid menu command:", menuCommand)
            return false
    }
    return true
}

function homeMenuConfirm() {
    openHomePage()
    displayStatusMessage(statusMessageHomeMenu, "Home Confirmed")
}

function homeMenuCancel() {
    closeHomeSubMenu(true)
    displayStatusMessage(statusMessageHomeMenu, "Home Cancelled")
}
