import tensorflow as tf
import pathlib
import os
import numpy as np

def manual_conversion():
    current_file = pathlib.Path(__file__)
    project_root = current_file.parent.parent # models/
    assets_dir = project_root / "assets"
    data_dir = project_root / "datasets" / "raw"
    
    keras_path = assets_dir / "best_disease_model.keras"
    tflite_path = assets_dir / "disease_detection.tflite"

    print(f"Loading Keras model from {keras_path}...")
    model = tf.keras.models.load_model(str(keras_path))

    print("Converting to TFLite with INT8 Quantization...")
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]

    # Representative Dataset generator
    def representative_dataset_gen():
        # Setup data generator for representative samples
        datagen = tf.keras.preprocessing.image.ImageDataGenerator(rescale=1./255)
        generator = datagen.flow_from_directory(
            data_dir,
            target_size=(224, 224),
            batch_size=1,
            class_mode='categorical',
            shuffle=True
        )
        for _ in range(50):
            img, _ = next(generator)
            yield [img.astype(np.float32)]

    # Relaxed Quantization (Hybrid) - More compatible
    # converter.representative_dataset = representative_dataset_gen # Optional for hybrid
    # converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
    # converter.inference_input_type = tf.float32
    # converter.inference_output_type = tf.float32

    tflite_model = converter.convert()

    with open(tflite_path, 'wb') as f:
        f.write(tflite_model)
    
    print(f"Success! Model converted to {tflite_path}")

if __name__ == "__main__":
    manual_conversion()
