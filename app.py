from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import cv2
from PIL import Image
import io

app = Flask(__name__)

# Load Pre-trained AI Model
model = tf.keras.models.load_model("waste_classification_model.h5")

# Define Waste Categories
CLASS_LABELS = ["Recyclable", "Organic", "Hazardous"]

# Image Preprocessing Function
def preprocess_image(image):
    image = image.resize((224, 224))  # Resize to model's expected input size
    image = np.array(image) / 255.0   # Normalize pixel values
    image = np.expand_dims(image, axis=0)  # Add batch dimension
    return image

# API Endpoint for Waste Classification
@app.route("/classify", methods=["POST"])
def classify_waste():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    image = Image.open(io.BytesIO(file.read()))  # Read image
    processed_image = preprocess_image(image)

    # Get Predictions
    predictions = model.predict(processed_image)
    predicted_class = CLASS_LABELS[np.argmax(predictions)]

    return jsonify({"category": predicted_class})

# Run Flask Server
if __name__ == "__main__":
    app.run(debug=True)
