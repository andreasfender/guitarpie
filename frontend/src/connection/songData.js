let allSongs = [];
let favoriteSongs = {};

const searchActions = document.getElementById("search-actions");

async function fetchAllSongs() {
    const response = await fetch("http://localhost:5000/list-songs");
    if (response.ok) {
        allSongs = await response.json();
        searchActions.style.display = "flex";
    } else {
        console.error("Failed to fetch song list");
    }
}

async function fetchFavoriteSongs() {
    try
    {
        const responseFav = await fetch("../songs/fav-songs.json").catch((ex) => {console.warn("Catching: " + ex)});
        if (responseFav.ok) {
            favoriteSongs = await responseFav.json();
        } else {
            console.warn("Failed to fetch favorite song list");
        }
    }
    catch (ex)
    {
        console.warn("Exception: " + ex);
    }

}

function deleteSong(filename) {
    if (confirm(`Are you sure you want to delete ${filename}?`)) {
        fetch("http://127.0.0.1:5000/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ filename }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message) {
                    fetchAllSongs();
                } else if (data.error) {
                    console.error(data.error);
                }
            })
            .catch((error) => {
                console.error("Error deleting the song:", error);
            })
            .finally(() => {
                displaySongLists();
            });
    }
}

async function markAsFavorite(filename) {
    // Toggle the favorite status in the favoriteSongs array
    if (favoriteSongs.favSongs.includes(filename)) {
        favoriteSongs.favSongs = favoriteSongs.favSongs.filter((song) => song !== filename);
    } else {
        favoriteSongs.favSongs.push(filename);
    }

    // Send updated favorites list to backend.
    await fetch("http://localhost:5000/update-favorites", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ favorites: favoriteSongs }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to update favorites");
            }
            return response.json();
        })
        .catch((error) => {
            console.error("Error updating favorites:", error);
        });
}

// Handle file upload upon selection on the start page
const uploadFormStartPage = document.getElementById("upload-form-start-page");
uploadFormStartPage.addEventListener("change", async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("http://localhost:5000/upload", {
            method: "POST",
            body: formData,
        });
        if (response.ok) {
            displaySidebarSongList();
        } else {
            console.error("Upload failed");
        }
        displaySongLists();
    }
});
