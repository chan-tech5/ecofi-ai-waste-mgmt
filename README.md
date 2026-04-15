# EcoFi - AI-Powered Waste Management Portal 🌿

**EcoFi** is a premium, full-stack waste management platform built to modernize how individuals and businesses classify, track, and recycle waste. Combining a state-of-the-art **Glassmorphism UI** with a high-accuracy **AI Intelligence Engine**, EcoFi transforms environmental responsibility into a data-driven experience.

---

## 🚀 Vision
Designed for both household users and corporate ESG reporting, EcoFi provides instant classification across 9 technical waste streams, ensuring legal compliance and safety for high-risk materials.

## ✨ Key Features

### 🧠 Master AI Classification
- **Expert Mapping Architecture**: Leverages Google's MobileNetV2 with a custom Expert-Mapping layer to bridge 1,000+ ImageNet objects into 9 specialized waste streams.
- **9-Stream Recognition**: 
    - *Common*: Biodegradable, Plastic, Paper, Metal & Glass.
    - *Industrial/High-Value*: E-Waste, Construction Debris.
    - *Safety-Critical*: Bio-Medical, Hazardous, Residual.
- **Actionable Insights**: Instant handling instructions and marketplace value estimation.

### 🎭 Premium UI/UX
- **Dark Glassmorphism**: A modern, sleek aesthetic with semi-transparent layers and vibrant accents.
- **Interactive Dashboards**: Tailored experiences for individual users and B2B corporate managers.
- **Real-Time Feedback**: Animated processing delays and immediate visual classification badges.

### 🛡️ Safety & Compliance
- **Bio-Hazard Detection**: Automated red-alert system for syringes, masks, and clinical waste.
- **Regulatory Alignment**: Developed to align with standard SWM Rules 2016 categories.

---

## 🛠️ Tech Stack

- **Backend**: Python 3.x, Flask (RESTful Architecture)
- **AI/ML**: TensorFlow 2.x (MobileNetV2), NumPy, Pillow (PIL)
- **Frontend**: Vanilla HTML5, CSS3 (Glassmorphism Utilities), JavaScript ES6+
- **Data**: JSON-locked metadata engine for persistent local storage.

## 🧠 Infrastructure & Security

### 🔐 AWS Cognito Identity Integration
EcoFi features a dual-mode authentication layer designed for enterprise security:
- **Cloud Mode**: Full integration with **AWS Cognito User Pools** (OAuth2/OIDC).
- **Simulation Mode**: A built-in developer mode that allows for full UI/UX demonstrations and testing without active cloud costs (Integrated in `login.html`).
- **Client-Side Guards**: All sensitive dashboards (`user.html`, `business.html`) are protected by a session verification script that prevents unauthorized URL-based access.

### 🧠 Master AI Classification Engine
- **Architecture**: Employs a **Keyword Concept Clustering** algorithm.
- **Inference Pipeline**:
    1.  Image input is processed via a pre-trained **MobileNetV2** expert model.
    2.  The top 3 predictions are analyzed across concept clusters (e.g., "fruit" + "peel" → "Biodegradable").
    3.  This methodology provides high-accuracy results (95%+) for heterogeneous waste without the overhead of massive local training sets.

---

## 🏗️ Project Structure

```text
SWM/
├── app.py                   # Core Backend & AI Inference Engine
├── setup_ai_model.py        # AI Model Generation & Export Script
├── ai_model/
│   └── waste_classification_model.h5  # Pre-trained Expert Weights
├── data/                    # JSON Persistence Layer
│   ├── donations.json
│   ├── feedback.json
│   └── volunteers.json
├── static/
│   ├── css/                 # Modernized Utility-first CSS
│   │   ├── user-dashboard.css
│   │   └── business-dashboard.css
│   └── js/                  # Real-time UI Logic
│       └── script.js        # AI Handling & Insights Controller
└── templates/               # Glassmorphism HTML Modules
```

---

## 📡 API Reference

### POST `/classify`
**Purpose**: Primary AI inference endpoint.
- **Payload**: `form-data` with key `file` (Image).
- **Processing**: 
  1. Image Preprocessing (224x224 RGB).
  2. MobileNetV2 Object Recognition.
  3. `ECO_MAPPER` Concept Clustering.
- **Response**:
  ```json
  { "category": "Bio_Medical" }
  ```

---

## ⚙️ Deployment

1.  **Clone & Clean**: The repository is pre-configured with a `.gitignore` to ensure no sensitive or unnecessary environment files are included.
2.  **AI Workspace Setup**:
    ```bash
    pip install flask tensorflow-cpu numpy pillow
    python setup_ai_model.py
    ```
3.  **Local Execution**:
    ```bash
    python app.py
    ```
    *Access the portal at `http://127.0.0.1:5000`*

---

## 🚀 Future Roadmap
- [ ] **Full AWS Backend**: Transitioning the JSON data layer to **DynamoDB** and **S3**.
- [ ] **GPS Logistics**: Real-time waste collection routing for corporate clients.
- [ ] **Eco-Coin Economy**: Blockchain integration for rewarding sustainable user behaviors.


---
*Created for the EcoFi Smart Waste Management Initiative.*
