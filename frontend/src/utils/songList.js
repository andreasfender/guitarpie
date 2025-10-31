// Display the list of songs in the sidebar
async function displaySidebarSongList() {
    const songList = document.getElementById("song-list-sidebar")
    songList.innerHTML = ""
    allSongs.forEach((song) => {
        const li = document.createElement("li")
        li.classList.add("song-item-sidebar")
        const n = song.name
        li.innerHTML = n.endsWith('.gp') ? n.slice(0, -3) : n
        li.setAttribute("data-file", song.path)
        li.setAttribute("style", "cursor: pointer;")
        songList.appendChild(li)
        if (settings.file === song.path) {
            li.setAttribute("style", "cursor: pointer; border-right: 6px solid #85beff;")
        }
        const separator = document.createElement("hr")
        separator.classList.add("separator")
        separator.style.opacity = "0.5"
        songList.appendChild(separator)
    })
}

// Search bar functionality
document.getElementById("searchBar").addEventListener("input", function () {
    const query = this.value.toLowerCase()
    const listItems = document.querySelectorAll("#song-list-start-page li")

    listItems.forEach((item) => {
        // Assume each list item contains the song name text.
        const songName = item.textContent.toLowerCase()
        if (songName.indexOf(query) !== -1) {
            item.style.display = "" // Show item
        } else {
            item.style.display = "none" // Hide item
        }
    })
})

// Display the list of songs on the main page
async function displayMainPageSongList() {
    const songList = document.getElementById("song-list-start-page")
    songList.innerHTML = ""

    const sortedAllSongs = allSongs.sort((a, b) => {
        // Sort by favorite status first
        if (favoriteSongs.favSongs.includes(a.name) && !favoriteSongs.favSongs.includes(b.name)) {
            return -1
        }
        if (!favoriteSongs.favSongs.includes(a.name) && favoriteSongs.favSongs.includes(b.name)) {
            return 1
        }
        // Sort by name
        return a.name.localeCompare
            ? a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
            : a.name - b.name
    })

    sortedAllSongs.forEach((song) => {
        const li = document.createElement("li")
        li.classList.add("song-item")
        li.setAttribute("data-file", song.path)
        li.innerHTML = song.name

        // Favorite button (with star icon)
        const favoriteBtn = document.createElement("img")
        favoriteBtn.classList.add("fav-btn")
        favoriteBtn.src = favoriteSongs.favSongs.includes(song.name)
            ? "./resources/codicons/dark/heart-filled.svg"
            : "./resources/codicons/dark/heart.svg"
        favoriteBtn.onclick = async () => {
            markAsFavorite(song.name)
            displayMainPageSongList()
        }
        li.appendChild(favoriteBtn)

        songList.appendChild(li)
    })
}

// Global flag to indicate if delete mode is active
let deleteMode = false

// Get references to the new buttons and file input
const uploadButton = document.getElementById("uploadButton")
const deleteButton = document.getElementById("deleteButton")
const fileInput = document.getElementById("file-input")

// When the Upload button is clicked, trigger file input click
uploadButton.addEventListener("click", () => {
    fileInput.click()
})

// When the Delete button is clicked, toggle delete mode
deleteButton.addEventListener("click", () => {
    deleteMode = !deleteMode
    deleteButton.textContent = deleteMode ? "Cancel Delete" : "Delete"
    deleteButton.style.backgroundColor = deleteMode ? "#ffa0a0a1" : "#ffffffa1"
})

// Display "error-prompt.svg"
async function displayMainPageSongFetchError() {
    const songList = document.getElementById("song-list-start-page")
    songList.innerHTML = `<img src="./resources/svg/light/error-promt.svg" alt="Error fetching songs" class="error-prompt">`
    songList.onclick = () => location.reload()
}

// Handle song selection in the sidebar
const songList = document.getElementById("song-list-sidebar")
songList.addEventListener("click", async (e) => {
    e.preventDefault()
    const file = e.target.getAttribute("data-file")
    if (file) {
        loadSong(file)
        closeAllPanels()
    }
})

// Handle song selection on the start page
const songListStartPage = document.getElementById("song-list-start-page")
songListStartPage.addEventListener("click", async (e) => {
    e.preventDefault()
    const file = e.target.getAttribute("data-file")
    if (file) {
        if (deleteMode === true) {
            const filename = e.target.textContent
            deleteSong(filename)
            // Exit delete mode after deletion
            deleteMode = false
            deleteButton.textContent = "Delete"
            deleteButton.style.backgroundColor = "#ffffffa1"
            return
        }
        loadSong(file)
        closeAllPanels()
    }
})
// Add event listeners for delete buttons
document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", function () {
        const filename = this.getAttribute("data-filename")
        deleteSong(filename)
    })
})

async function displaySongLists() {
    fetchAllSongs()
        .then(() => {
            displayMainPageSongList()
            displaySidebarSongList()
        })
        .catch(() => {
            displayMainPageSongFetchError()
        })
}
