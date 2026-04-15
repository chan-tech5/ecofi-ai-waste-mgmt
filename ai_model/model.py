import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Load dataset (Ensure you have labeled waste images)
train_datagen = ImageDataGenerator(rescale=1./255)
train_generator = train_datagen.flow_from_directory("data/train", target_size=(224, 224), batch_size=32, class_mode="categorical")

# Define CNN Model
model = Sequential([
    Conv2D(32, (3,3), activation="relu", input_shape=(224, 224, 3)),
    MaxPooling2D(2,2),
    Flatten(),
    Dense(128, activation="relu"),
    Dense(3, activation="softmax")  # Assuming 3 categories: Recyclable, Organic, Hazardous
])

# Compile & Train Model
model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])
model.fit(train_generator, epochs=10)

# Save Model
model.save("waste_classification_model.h5")
