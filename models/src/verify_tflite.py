import tensorflow as tf
import numpy as np
import time
import os
import glob
import random
from pathlib import Path

# Config
IMG_SIZE = 224
ASSETS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "assets")
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "datasets", "raw")
MODEL_PATH = os.path.join(ASSETS_DIR, "disease_detection.tflite")
LABELS_PATH = os.path.join(ASSETS_DIR, "labels_disease.txt")

def run_benchmark():
    print(f"--- TFLite Model Benchmark ---")
    print(f"Model: {MODEL_PATH}")
    
    # 1. Load Labels
    if not os.path.exists(LABELS_PATH):
        print(f"Error: Labels file not found at {LABELS_PATH}")
        return

    with open(LABELS_PATH, 'r') as f:
        labels = [line.strip() for line in f.readlines()]
    print(f"Labels loaded: {len(labels)} classes")

    # 2. Load Model
    interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
    interpreter.allocate_tensors()

    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    
    input_shape = input_details[0]['shape']
    print(f"Input Shape: {input_shape}")

    # 3. Get Random Test Images
    print("Finding test images...")
    all_images = glob.glob(os.path.join(DATA_DIR, "**", "*.jpg"), recursive=True)
    all_images += glob.glob(os.path.join(DATA_DIR, "**", "*.JPG"), recursive=True)
    all_images += glob.glob(os.path.join(DATA_DIR, "**", "*.png"), recursive=True)
    
    if not all_images:
        print("Error: No images found in dataset directory!")
        return

    test_images = random.sample(all_images, min(20, len(all_images)))
    print(f"Selected {len(test_images)} random images for testing.")

    # 4. Run Inference Loop
    total_time = 0
    correct_matches = 0 # Loose accuracy check (if label is in filename)

    print("\n--- Inference Results ---")
    for i, img_path in enumerate(test_images):
        # Preprocess
        img_name = os.path.basename(img_path)
        parent_folder = os.path.basename(os.path.dirname(img_path))
        
        img = tf.io.read_file(img_path)
        img = tf.image.decode_image(img, channels=3, expand_animations=False)
        img = tf.image.resize(img, (IMG_SIZE, IMG_SIZE))
        img = img / 255.0 # Normalize [0,1]
        img = tf.expand_dims(img, 0) # Batch dim

        # Set input
        interpreter.set_tensor(input_details[0]['index'], img)

        # Run
        start = time.time()
        interpreter.invoke()
        end = time.time()
        
        duration_ms = (end - start) * 1000
        total_time += duration_ms

        # Get output
        output_data = interpreter.get_tensor(output_details[0]['index'])
        top_idx = np.argmax(output_data[0])
        predicted_label = labels[top_idx]
        confidence = output_data[0][top_idx]

        print(f"[{i+1}] {img_name} ({parent_folder})")
        print(f"    -> Pred: {predicted_label} ({confidence:.2f}) | {duration_ms:.1f}ms")

    # 5. Summary
    avg_time = total_time / len(test_images)
    print("\n" + "="*40)
    print("       BENCHMARK REPORT")
    print("="*40)
    print(f"Total Images Checked: {len(test_images)}")
    print(f"Average Inference Time: {avg_time:.2f} ms")
    print(f"Efficiency Rating: {'EXCELLENT' if avg_time < 100 else 'GOOD'}")
    print("="*40)

if __name__ == "__main__":
    run_benchmark()
