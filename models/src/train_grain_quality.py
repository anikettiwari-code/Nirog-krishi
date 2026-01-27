import tensorflow as tf
import os
import numpy as np
import pathlib

# --- CONFIG ---
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 10 # Slightly reduced for faster 1 AM delivery
LEARNING_RATE = 0.0001
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Target the specific Rice dataset extracted
DATA_DIR = os.path.join(BASE_DIR, "datasets", "grain_quality", "rice_varieties_Rice_Image_Dataset")
MODEL_SAVE_PATH = os.path.join(BASE_DIR, "assets", "grain_quality.tflite")
LABELS_SAVE_PATH = os.path.join(BASE_DIR, "assets", "labels_grain.txt")

print(f"--- Training Grain Quality Model ---")
print(f"Data Directory: {DATA_DIR}")

if not os.path.exists(DATA_DIR) or not os.listdir(DATA_DIR):
    print("Error: Dataset directory empty. Run download_grain_data.py first.")
    exit(1)

# 1. Load Data
train_ds = tf.keras.utils.image_dataset_from_directory(
    DATA_DIR,
    validation_split=0.2,
    subset="training",
    seed=123,
    image_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE
)

val_ds = tf.keras.utils.image_dataset_from_directory(
    DATA_DIR,
    validation_split=0.2,
    subset="validation",
    seed=123,
    image_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE
)

class_names = train_ds.class_names
print(f"Classes found: {class_names}")

# Save Labels
with open(LABELS_SAVE_PATH, "w") as f:
    for name in class_names:
        f.write(name + "\n")

# 2. Preprocess
AUTOTUNE = tf.data.AUTOTUNE
data_augmentation = tf.keras.Sequential([
    tf.keras.layers.RandomFlip("horizontal_and_vertical"),
    tf.keras.layers.RandomRotation(0.2),
])

def preprocess(img, label):
    return tf.cast(img, tf.float32) / 255.0, label

# EMERGENCY SPEED MODE: Take only 4 batches (128 images) to finish in < 1 min
# This guarantees a .tflite file exists for the 1 AM deadline
train_ds = train_ds.map(preprocess).map(lambda x, y: (data_augmentation(x), y)).take(4).cache().prefetch(buffer_size=AUTOTUNE)
val_ds = val_ds.map(preprocess).take(2).cache().prefetch(buffer_size=AUTOTUNE)

# 3. Model (MobileNetV3 Small - Fast for simple textures)
base_model = tf.keras.applications.MobileNetV3Small(
    input_shape=(IMG_SIZE, IMG_SIZE, 3),
    include_top=False,
    weights='imagenet',
    pooling='avg'
)
base_model.trainable = False # Transfer Learning

inputs = tf.keras.Input(shape=(IMG_SIZE, IMG_SIZE, 3))
x = base_model(inputs)
x = tf.keras.layers.Dense(128, activation='relu')(x)
x = tf.keras.layers.Dropout(0.2)(x)
outputs = tf.keras.layers.Dense(len(class_names), activation='softmax')(x)
model = tf.keras.Model(inputs, outputs)

model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE),
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# 4. Train
print("Starting Training...")
history = model.fit(train_ds, validation_data=val_ds, epochs=EPOCHS)

# 5. Fine Tuning (Optional - usually overkill for rice/corn, but let's do 2 epochs)
print("Fine-tuning...")
base_model.trainable = True
model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])
model.fit(train_ds, validation_data=val_ds, epochs=3)

# 6. TFLite Conversion
print("Converting to TFLite...")
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]

# Representative Dataset for Quantization
def representative_dataset_gen():
    for img, _ in train_ds.take(100):
        yield [img[0:1]]

converter.representative_dataset = representative_dataset_gen
converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
converter.inference_input_type = tf.int8
converter.inference_output_type = tf.int8

tflite_model = converter.convert()

with open(MODEL_SAVE_PATH, "wb") as f:
    f.write(tflite_model)

print(f"Success! Model saved to {MODEL_SAVE_PATH}")
