from flask import Flask, render_template, request, jsonify
import requests



app = Flask(__name__)

# TransportAPI Credentials
APP_ID = "51682127"
APP_KEY = "1d77b29d2b0ca93dbe43211335da690e"

def get_train_data(from_station, to_station):
    url = f"https://transportapi.com/v3/uk/train/station/{from_station}/live.json"
    params = {
        "app_id": APP_ID,
        "app_key": APP_KEY,
        "calling_at": to_station,
        "darwin": "false",
        "train_status": "passenger"
    }

    response = requests.get(url, params=params)

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error fetching API data: {response.status_code}")
        return None

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/search", methods=["POST"])
def search_trains():
    from_station = request.form.get("from_station").upper()
    to_station = request.form.get("to_station").upper()

    train_data = get_train_data(from_station, to_station)

    if train_data and "departures" in train_data:
        return jsonify(train_data["departures"]["all"])
    else:
        return jsonify({"error": "No trains found"}), 404

if __name__ == "__main__":
    app.run(debug=True)
