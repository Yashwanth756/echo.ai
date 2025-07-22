from flask import Flask, jsonify
from flask_cors import CORS
from apikeyManager import APIKeyManager
app = Flask(__name__)
CORS(app)

# Example keys with model
key_data = [
    ("AIzaSyCp8okCQjCZ7iCeItLgfeLh5v0a6nIE2Jo", "gemini-2.0-flash-lite", 30, 200),
    ("AIzaSyAUjUvHX8WrTtfeoLQQks5zxAyXbYkLBww", "gemini-2.0-flash-lite", 30, 200),
    ("AIzaSyBERkzxfo0L9q8uWPt5YScDqmmIcvIkF4", "gemini-2.0-flash-lite", 30, 200),
    ("AIzaSyCc0ZYxEuoocwAZ5jKM8fWQEd0wz6sh4uI", "gemini-2.0-flash-lite", 30, 200),
    ("AIzaSyCRk2Yipn_lreY__-KFoCI0Uvi8XAQlVyM", "gemini-2.0-flash-lite", 30, 200),
]

manager = APIKeyManager(key_data)

@app.route("/get-api-key", methods=["GET"])
def get_api_key():
    key, model = manager.get_available_key()
    return jsonify({"apiKey": key, "model": model})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
