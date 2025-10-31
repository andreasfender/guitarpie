// Button to toggle pinning the header
const pinHeaderButton = document.getElementById("pinHeaderButton")
let isHeaderPinned = false
pinHeaderButton.onclick = togglePinning

function togglePinning() {
    if (isHeaderPinned) {
        isHeaderPinned = false
        pinHeaderButton.classList.remove("active")
        tabs.style.marginTop = "0"
    } else {
        isHeaderPinned = true
        pinHeaderButton.classList.add("active")
        tabs.style.marginTop = "60px"
    }
}

function unpinHeader() {
    if (isHeaderPinned) {
        togglePinning()
    }
}

// Tick box for enlarging the pie menu
const enlargePieMenuCheckbox = document.getElementById("enlargePieMenuCheckbox");
let enlargePieMenu = false;
enlargePieMenuCheckbox.onchange = function () {
    enlargePieMenu = this.checked;
    updatePieMenuSize();
};

// Slider for the pie menu oppacity
const pieMenuOppacitySlider = document.getElementById("pieMenuOppacitySlider");
let pieMenuOppacity = 100;
const pieMenuOppacityTooltip = document.createElement("div");
pieMenuOppacityTooltip.classList.add("slider-tooltip");
pieMenuOppacityTooltip.textContent = pieMenuOppacitySlider.value + "%";
pieMenuOppacitySlider.parentElement.appendChild(pieMenuOppacityTooltip);
pieMenuOppacitySlider.oninput = function () {
    pieMenuOppacityTooltip.textContent = this.value + "%";
    pieMenuOppacity = this.value;
    updatePieMenuOppacity();
};
pieMenuOppacitySlider.addEventListener("mouseover", () => (pieMenuOppacityTooltip.style.display = "block"));
pieMenuOppacitySlider.addEventListener("mouseout", () => (pieMenuOppacityTooltip.style.display = "none"));
pieMenuOppacitySlider.oninput();

// Tick box for pausing on silence
const pauseOnSilenceCheckbox = document.getElementById("pauseOnSilenceCheckbox");
let pauseOnSilence = true;
pauseOnSilenceCheckbox.onchange = function () {
    pauseOnSilence = this.checked;
};

function updatePieMenuSize() {
    const pieMenus = document.querySelectorAll(".fretmenu");
    if (enlargePieMenu) {
        pieMenus.forEach((pieMenu) => (pieMenu.style.animation = "none"));
        setTimeout(() => {
            pieMenus.forEach((pieMenu) => (pieMenu.style.right = "48%"));
            pieMenus.forEach((pieMenu) => (pieMenu.style.bottom = "50%"));
            pieMenus.forEach((pieMenu) => (pieMenu.style.scale = "1.1"));
            pieMenus.forEach((pieMenu) => (pieMenu.style.transform = "translate(50%, 50%)"));
        }, 10);
    } else {
        pieMenus.forEach((pieMenu) => (pieMenu.style.scale = "0.7"));
        pieMenus.forEach((pieMenu) => (pieMenu.style.transform = "none"));
        pieMenus.forEach((pieMenu) => (pieMenu.style.right = "50px"));
        pieMenus.forEach((pieMenu) => (pieMenu.style.bottom = "30px"));
    }
}

function updatePieMenuOppacity() {
    const pieMenus = document.querySelectorAll(".fretmenu");
    pieMenus.forEach((pieMenu) => (pieMenu.style.backgroundColor = `rgba(255, 255, 255, ${pieMenuOppacity / 100})`));
}

// Tick box for toggling exit on sub menu close
const exitOnSubMenuCloseCheckbox = document.getElementById("exitOnSubMenuCloseCheckbox");
let exitOnSubMenuClose = false;
exitOnSubMenuCloseCheckbox.onchange = function () {
    exitOnSubMenuClose = this.checked;
};

// Tick box for enabling double click mode on fret menu
const fretMenuDoubleClickModeCheckbox = document.getElementById("fretMenuDoubleClickModeCheckbox");
let fretMenuDoubleClickMode = false;
fretMenuDoubleClickModeCheckbox.onchange = function () {
    fretMenuDoubleClickMode = this.checked;
};
