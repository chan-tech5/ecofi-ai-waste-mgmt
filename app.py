from flask import Flask, request, jsonify, render_template
import os
import numpy as np
from PIL import Image
import io

app = Flask(
    __name__,
    template_folder='templates',
    static_folder='static',
    static_url_path='/static'
)

# Define Waste Categories (9 Streams)
CLASS_LABELS = [
    "Biodegradable", "Plastic", "Paper", "Metal_Glass", 
    "E-Waste", "Construction_Debris", "Bio_Medical", 
    "Hazardous", "Residual"
]

# Try to load AI model if available
model = None
MODEL_PATH = os.path.join("ai_model", "waste_classification_model.h5")
if os.path.exists(MODEL_PATH):
    try:
        import tensorflow as tf
        model = tf.keras.models.load_model(MODEL_PATH)
        print("✅ AI model loaded successfully.")
    except Exception as e:
        print(f"⚠️ Could not load model: {e}")
else:
    print(f"⚠️ Model file not found. Classification will use mock predictions.")

# Image Preprocessing Function
def preprocess_image(image):
    image = image.resize((224, 224))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    return image

# ── Page Routes ──────────────────────────────────────────────
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/<path:page>")
def serve_page(page):
    if page.endswith(".html"):
        try:
            return render_template(page)
        except Exception:
            return "Page not found", 404
    return app.send_static_file(page)

# ── Donation Storage ─────────────────────────────────────────
import json
from datetime import datetime

DONATIONS_FILE = os.path.join("data", "donations.json")
os.makedirs("data", exist_ok=True)
if not os.path.exists(DONATIONS_FILE):
    with open(DONATIONS_FILE, "w") as f:
        json.dump([], f)

@app.route("/api/donate", methods=["POST"])
def donate():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"}), 400

    required = ["name", "email", "phone", "amount", "payment"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"Missing field: {field}"}), 400

    try:
        amount = int(data["amount"])
        if amount < 1:
            return jsonify({"error": "Amount must be at least ₹1"}), 400
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid amount"}), 400

    # Build donation record
    receipt_id = "ECO-" + datetime.now().strftime("%Y%m%d%H%M%S") + "-" + os.urandom(3).hex().upper()
    record = {
        "receipt_id": receipt_id,
        "name": data["name"],
        "email": data["email"],
        "phone": data["phone"],
        "amount": amount,
        "payment": data["payment"],
        "frequency": data.get("frequency", "one-time"),
        "message": data.get("message", ""),
        "kg_recycled": round(amount / 10),
        "co2_saved": round(amount / 8),
        "timestamp": datetime.now().isoformat()
    }

    # Save to JSON file
    try:
        with open(DONATIONS_FILE, "r") as f:
            donations = json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        donations = []

    donations.append(record)
    with open(DONATIONS_FILE, "w") as f:
        json.dump(donations, f, indent=2)

    print(f"💚 Donation received: {receipt_id} — ₹{amount} from {data['name']}")

    return jsonify({
        "success": True,
        "receipt_id": receipt_id,
        "amount": amount,
        "kg_recycled": record["kg_recycled"],
        "co2_saved": record["co2_saved"],
        "date": datetime.now().strftime("%d %B %Y")
    })

# ── API Routes ───────────────────────────────────────────────
@app.route("/classify", methods=["POST"])
def classify_waste():
    from tensorflow.keras.applications.mobilenet_v2 import decode_predictions
    import time
    
    # Simulate AI processing time for UX
    time.sleep(1.2)

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    file_bytes = file.read()
    image = Image.open(io.BytesIO(file_bytes))
    processed_image = preprocess_image(image)

    if model:
        # 1. Get the 1,000-class predictions from the expert model
        preds = model.predict(processed_image)
        # 2. Convert raw numbers to readable object names (Check top 3 for better context)
        decoded = decode_predictions(preds, top=3)[0]
        
        # Intelligence Clusters: Mapping concepts, not just words
        CLUSTERS = {
            "Biodegradable": ["banana", "peel", "apple", "fruit", "vegetable", "cabbage", "food", "egg", "bread", "leaf", "plant", "organic", "organism"],
            "Plastic": ["bottle", "flask", "vial", "plastic", "container", "poly", "packaging", "wrap", "beaker", "cup"],
            "Paper": ["notebook", "envelope", "paper", "cardboard", "carton", "menu", "book", "shredder", "packet", "shredding", "tissue", "towelling"],
            "Metal_Glass": ["can", "tin", "metal", "glass", "beer", "wine", "pop", "beaker", "goblet", "brass", "steel", "aluminum"],
            "E-Waste": ["laptop", "mouse", "keyboard", "monitor", "joystick", "cord", "plug", "phone", "electronics", "circuit", "tab"],
            "Construction_Debris": ["brick", "tile", "concrete", "stone", "debris", "roof", "lumber", "cement"],
            "Bio_Medical": ["syringe", "mask", "medical", "hospital", "needle", "clinical", "stretcher"],
            "Hazardous": ["aerosol", "battery", "chemical", "toxic", "poison"],
        }

        predicted_class = "Residual" # Default
        
        # Loop through top 3 predictions to find a keyword match
        found_match = False
        for i in range(3):
            label = decoded[i][1].lower().replace('_', ' ')
            confidence = decoded[i][2]
            
            # Check every cluster
            for category, keywords in CLUSTERS.items():
                if any(kw in label for kw in keywords):
                    predicted_class = category
                    found_match = True
                    debug_info = f"AI saw '{label}' ({confidence:.2f}) -> Match found in '{category}'"
                    break
            if found_match: break
            
        if not found_match:
            debug_info = f"AI saw '{decoded[0][1]}' ({decoded[0][2]:.2f}) -> No keyword match. Fallback to Residual."
            
        print(f"DEBUG: {debug_info}")
        
    else:
        # Fallback to hash consistency if model fail
        import hashlib
        img_hash = hashlib.md5(file_bytes).hexdigest()
        stable_index = int(img_hash[:8], 16) % len(CLASS_LABELS)
        predicted_class = CLASS_LABELS[stable_index]

    return jsonify({"category": predicted_class})

# ── Feedback Storage ─────────────────────────────────────────
FEEDBACK_FILE = os.path.join("data", "feedback.json")
if not os.path.exists(FEEDBACK_FILE):
    with open(FEEDBACK_FILE, "w") as f:
        json.dump([], f)

@app.route("/api/feedback", methods=["POST"])
def feedback():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"}), 400

    for field in ["name", "email", "category", "message"]:
        if not data.get(field):
            return jsonify({"error": f"Missing field: {field}"}), 400

    record = {
        "id": "FB-" + datetime.now().strftime("%Y%m%d%H%M%S") + "-" + os.urandom(2).hex().upper(),
        "name": data["name"],
        "email": data["email"],
        "category": data["category"],
        "rating": data.get("rating", 0),
        "message": data["message"],
        "timestamp": datetime.now().isoformat()
    }

    try:
        with open(FEEDBACK_FILE, "r") as f:
            feedbacks = json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        feedbacks = []

    feedbacks.append(record)
    with open(FEEDBACK_FILE, "w") as f:
        json.dump(feedbacks, f, indent=2)

    print(f"📝 Feedback received: {record['id']} from {data['name']}")
    return jsonify({"success": True, "id": record["id"]})

# ── Volunteer Storage ────────────────────────────────────────
VOLUNTEER_FILE = os.path.join("data", "volunteers.json")
if not os.path.exists(VOLUNTEER_FILE):
    with open(VOLUNTEER_FILE, "w") as f:
        json.dump([], f)

@app.route("/api/volunteer", methods=["POST"])
def volunteer():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"}), 400

    for field in ["name", "email", "role"]:
        if not data.get(field):
            return jsonify({"error": f"Missing field: {field}"}), 400

    record = {
        "id": "VOL-" + datetime.now().strftime("%Y%m%d%H%M%S") + "-" + os.urandom(2).hex().upper(),
        "name": data["name"],
        "email": data["email"],
        "phone": data.get("phone", ""),
        "city": data.get("city", ""),
        "role": data["role"],
        "availability": data.get("availability", ""),
        "message": data.get("message", ""),
        "timestamp": datetime.now().isoformat()
    }

    try:
        with open(VOLUNTEER_FILE, "r") as f:
            volunteers = json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        volunteers = []

    volunteers.append(record)
    with open(VOLUNTEER_FILE, "w") as f:
        json.dump(volunteers, f, indent=2)

    print(f"🤝 Volunteer registered: {record['id']} — {data['name']} as {data['role']}")
    return jsonify({"success": True, "id": record["id"]})

# ── Discussion Storage ───────────────────────────────────────
DISCUSSION_FILE = os.path.join("data", "discussions.json")
if not os.path.exists(DISCUSSION_FILE):
    with open(DISCUSSION_FILE, "w") as f:
        json.dump([], f)

@app.route("/api/discussion", methods=["POST"])
def discussion():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"}), 400

    if not data.get("name") or not data.get("message"):
        return jsonify({"error": "Name and message are required"}), 400

    record = {
        "id": "DISC-" + datetime.now().strftime("%Y%m%d%H%M%S") + "-" + os.urandom(2).hex().upper(),
        "name": data["name"],
        "message": data["message"],
        "timestamp": datetime.now().isoformat()
    }

    try:
        with open(DISCUSSION_FILE, "r") as f:
            discussions = json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        discussions = []

    discussions.append(record)
    with open(DISCUSSION_FILE, "w") as f:
        json.dump(discussions, f, indent=2)

    print(f"💬 Discussion post: {record['id']} from {data['name']}")
    return jsonify({"success": True, "id": record["id"]})

# ── Event Registration Storage ───────────────────────────────
REGISTRATIONS_FILE = os.path.join("data", "event_registrations.json")
if not os.path.exists(REGISTRATIONS_FILE):
    with open(REGISTRATIONS_FILE, "w") as f:
        json.dump([], f)

@app.route("/api/event-register", methods=["POST"])
def event_register():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"}), 400

    for field in ["event_id", "event_title", "name", "email", "phone"]:
        if not data.get(field):
            return jsonify({"error": f"Missing field: {field}"}), 400

    reg_id = "EVT-" + datetime.now().strftime("%Y%m%d%H%M%S") + "-" + os.urandom(2).hex().upper()
    record = {
        "registration_id": reg_id,
        "event_id": data["event_id"],
        "event_title": data["event_title"],
        "name": data["name"],
        "email": data["email"],
        "phone": data["phone"],
        "team_size": data.get("team_size", "1"),
        "note": data.get("note", ""),
        "timestamp": datetime.now().isoformat()
    }

    try:
        with open(REGISTRATIONS_FILE, "r") as f:
            registrations = json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        registrations = []

    registrations.append(record)
    with open(REGISTRATIONS_FILE, "w") as f:
        json.dump(registrations, f, indent=2)

    print(f"🎟️ Event registration: {reg_id} — {data['name']} for {data['event_title']}")
    return jsonify({"success": True, "registration_id": reg_id})


# ── Marketplace Order ──
ORDERS_FILE = os.path.join("data", "orders.json")
if not os.path.exists(ORDERS_FILE):
    with open(ORDERS_FILE, "w") as f:
        json.dump([], f)

@app.route("/api/order", methods=["POST"])
def place_order():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"}), 400

    for field in ["name", "email", "phone", "payment", "address", "items", "total"]:
        if not data.get(field):
            return jsonify({"error": f"Missing field: {field}"}), 400

    order_id = "ORD-" + datetime.now().strftime("%Y%m%d%H%M%S") + "-" + os.urandom(2).hex().upper()
    record = {
        "order_id": order_id,
        "name": data["name"],
        "email": data["email"],
        "phone": data["phone"],
        "payment": data["payment"],
        "address": data["address"],
        "items": data["items"],
        "total": data["total"],
        "coins_earned": data.get("coins_earned", 0),
        "status": "confirmed",
        "timestamp": datetime.now().isoformat()
    }

    try:
        with open(ORDERS_FILE, "r") as f:
            orders = json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        orders = []

    orders.append(record)
    with open(ORDERS_FILE, "w") as f:
        json.dump(orders, f, indent=2)

    print(f"🛒 Order placed: {order_id} — {data['name']} — ₹{data['total']}")
    return jsonify({"success": True, "order_id": order_id})


# ── Run Server ───────────────────────────────────────────────
if __name__ == "__main__":
    print("🚀 Starting EcoFi server at http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
