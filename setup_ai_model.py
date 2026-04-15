import os
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model

# Configuration
MODEL_DIR = "ai_model"
MODEL_NAME = "waste_classification_model.h5"
CLASS_LABELS = [
    "Biodegradable", "Plastic", "Paper", "Metal_Glass", 
    "E-Waste", "Construction_Debris", "Bio_Medical", 
    "Hazardous", "Residual"
]

def create_ai_model():
    print("🚀 Initializing Expert AI Model Generation...")
    
    if not os.path.exists(MODEL_DIR):
        os.makedirs(MODEL_DIR)
        print(f"📁 Created directory: {MODEL_DIR}")

    # Load standard MobileNetV2 WITH the classification top (1000 classes)
    print("📡 Downloading vanilla MobileNetV2 (ImageNet Expert)...")
    model = MobileNetV2(weights='imagenet', include_top=True)

    # Save the model
    save_path = os.path.join(MODEL_DIR, MODEL_NAME)
    model.save(save_path)
    
    print(f"✅ SUCCESS: 'Expert' AI model generated and saved at: {save_path}")
    print("💡 This model knows 1,000 objects. We will now map them to EcoFi categories.")


if __name__ == "__main__":
    create_ai_model()
