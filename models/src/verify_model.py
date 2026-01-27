import tensorflow as tf
import numpy as np
import cv2
import os
import pathlib
import random
import json

def verify_tflite_model(model_name="disease_detection.tflite"):
    current_file = pathlib.Path(__file__)
    project_root = current_file.parent.parent # models/
    assets_dir = project_root / "assets"
    model_path = assets_dir / model_name
    
    if not model_path.exists():
        print(f"Error: Model {model_name} not found in assets/")
        return

    # Load TFLite Model
    interpreter = tf.lite.Interpreter(model_path=str(model_path))
    interpreter.allocate_tensors()

    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    
    input_shape = input_details[0]['shape']
    IMG_SIZE = input_shape[1] # Assuming square (1, 224, 224, 3)

    # Load Labels
    labels = []
    if "disease" in model_name:
        labels_path = assets_dir / "labels_disease.txt"
        img_root = project_root / "datasets" / "raw"
    else:
        # leaf check has explicit binary classes
        labels = ["random", "leaf"] 
        img_root = project_root / "datasets" / "leaf_check"

    if not labels and labels_path.exists():
        with open(labels_path, "r") as f:
            labels = [line.strip() for line in f.readlines()]

    print(f"Loaded {model_name} with {len(labels)} classes.")

    # Pick Random Image
    all_images = []
    for root, dirs, files in os.walk(img_root):
        for file in files:
             if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                 # Store full path and parent folder name (which is the Class Label)
                 class_name = os.path.basename(root)
                 all_images.append((os.path.join(root, file), class_name))
    
    if not all_images:
        print("No images found to test.")
        return

    # Test 5 random images
    print("\n--- Running Verification Tests ---")
    for _ in range(5):
        img_path, actual_label = random.choice(all_images)
        
        # Preprocess
        img = cv2.imread(img_path)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img_resized = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
        
        # Normalize (0-1) - Same as training
        input_data = np.expand_dims(img_resized, axis=0).astype(np.float32) / 255.0
        
        # Inference
        interpreter.set_tensor(input_details[0]['index'], input_data)
        interpreter.invoke()
        output_data = interpreter.get_tensor(output_details[0]['index'])
        
        # Decode
        if len(labels) == 2 and output_data.shape[1] == 1:
            # Binary Case (Leaf Check)
            score = output_data[0][0]
            predicted_idx = 1 if score > 0.5 else 0
            confidence = score if score > 0.5 else 1 - score
        else:
            # Categorical Case (Disease)
            predicted_idx = np.argmax(output_data)
            confidence = np.max(output_data)

        predicted_label = labels[predicted_idx] if predicted_idx < len(labels) else str(predicted_idx)
        
        # Result
        status = "✅ PASS" if actual_label in predicted_label or predicted_label in actual_label else "❌ FAIL"
        # Note: simplistic string matching, actual dataset folders usually match label names
        
        print(f"Image: ...{os.path.basename(img_path)}")
        print(f"Actual: {actual_label} | Predicted: {predicted_label} ({confidence:.2f}) -> {status}")

if __name__ == "__main__":
    import sys
    model = "disease_detection.tflite"
    if len(sys.argv) > 1:
        model = sys.argv[1]
    
    verify_tflite_model(model)
