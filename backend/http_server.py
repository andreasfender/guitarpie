import http.server
import socketserver
import threading
import time
from webbrowser import open as open_browser
import os

from flask import Flask, request, jsonify, send_from_directory
import backend.utils.logging as logging
from flask_cors import CORS
import json

PORT = 8000
URL = "http://localhost:8000/frontend/"

### Setup ###

app = Flask(__name__, static_folder="../frontend", static_url_path="")
CORS(app)


def run_flask():
    app.run(host="localhost", port=5000, use_reloader=False)


UPLOAD_FOLDER = "songs"
FAV_SONGS_PATH = "songs/fav-songs.json"
ALLOWED_EXTENSIONS = {"gp", "gp3", "gp4", "gp5"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

### Song Data Endpoints ###

@app.route("/list-songs", methods=["GET"])
def list_songs():
    songs = []

    try:
        for filename in os.listdir(UPLOAD_FOLDER):
            if allowed_file(filename):

                songs.append(
                    {
                        "name": filename,
                        "path": f"../songs/{filename}",
                    }
                )

    except Exception as e:
        logging.print_cl(e, logging.bcolors.FAIL)
        return jsonify({"error": str(e)}), 500

    return jsonify(songs), 200

#@app.route("/TabCtrl")
#def open_tabctrl():
#    return send_from_directory(app.static_folder, "index.html")


@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    return jsonify({"message": f"File {file.filename} uploaded successfully!"}), 200


@app.route("/delete", methods=["POST"])
def delete_file():
    data = request.get_json()
    if not data or "filename" not in data:
        return jsonify({"error": "No file provided"}), 400

    filename = data["filename"]
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(filepath):
        return jsonify({"error": "File not found"}), 404

    try:
        os.remove(filepath)
        return jsonify({"message": f"File {filename} deleted successfully!"}), 200

    except Exception as e:
        logging.print_cl(e, logging.bcolors.FAIL)
        return jsonify({"error": str(e)}), 500


@app.route("/update-favorites", methods=["POST"])
def update_favorites():
    data = request.get_json()
    if not data or "favorites" not in data:
        return jsonify({"error": "Invalid data"}), 400

    try:
        with open(FAV_SONGS_PATH, "w") as f:
            json.dump(data["favorites"], f)
        return jsonify({"message": "Favorites updated successfully"}), 200

    except Exception as e:
        logging.print_cl(e, logging.bcolors.FAIL)
        return jsonify({"error": str(e)}), 500


### Main ###

def start_server():
    Handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving HTTP on port {PORT}...")
        httpd.serve_forever()


if __name__ == "__main__":
    flask_thread = threading.Thread(target=run_flask)
    server_thread = threading.Thread(target=start_server)
    server_thread.daemon = True
    server_thread.start()
    flask_thread.start()
    if not os.path.exists("songs/fav-songs.json"):
        print("Creating fav file")
        with open("songs/fav-songs.json", "w") as file:
            file.write("{\"favSongs\": []}")
    time.sleep(1)  # Allow server to start
    open_browser("http://localhost:8000/frontend")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        pass
