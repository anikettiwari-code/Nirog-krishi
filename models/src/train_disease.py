import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV3Large
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, ReduceLROnPlateau, EarlyStopping
import os
import pathlib
import numpy as np

# Config (SPEED RUN)
IMG_SIZE = 224
BATCH_SIZE = 64
EPOCHS = 1       # Final pass for 1 AM deadline
LEARNING_RATE = 1e-3 # Increased LR for faster convergence

def train_model():
    current_file = pathlib.Path(__file__)
    project_root = current_file.parent.parent # models/
    data_dir = project_root / "datasets" / "raw"
    assets_dir = project_root / "assets"
    
    if not assets_dir.exists():
        os.makedirs(assets_dir, exist_ok=True)

    print(f"Loading data from: {data_dir}")

    # Data Augmentation
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=30,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest',
        validation_split=0.2
    )

    train_generator = train_datagen.flow_from_directory(
        data_dir,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training',
        shuffle=True
    )

    validation_generator = train_datagen.flow_from_directory(
        data_dir,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation',
        shuffle=False
    )

    num_classes = train_generator.num_classes
    class_names = list(train_generator.class_indices.keys())
    print(f"Found {num_classes} classes: {class_names}")
    
    # Save labels
    with open(assets_dir / "labels_disease.txt", "w") as f:
        for name in class_names:
            f.write(name + "\n")

    # Model Architecture (MobileNetV3Large - Standard for Mobile Vision)
    base_model = MobileNetV3Large(weights='imagenet', include_top=False, input_shape=(IMG_SIZE, IMG_SIZE, 3))
    
    # Freeze base model initially
    base_model.trainable = False

    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(1024, activation='relu')(x)
    x = Dropout(0.2)(x)
    predictions = Dense(num_classes, activation='softmax')(x)

    model = Model(inputs=base_model.input, outputs=predictions)

    model.compile(optimizer=Adam(learning_rate=LEARNING_RATE),
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])

    # Resume from checkpoint if exists
    checkpoint_path = assets_dir / "best_disease_model.keras"
    if checkpoint_path.exists():
        print(f"--- RESUMING from checkpoint: {checkpoint_path} ---")
        try:
            model.load_weights(str(checkpoint_path))
            print("Weights loaded successfully!")
        except Exception as e:
            print(f"Could not load weights (might be architecture mismatch): {e}")

    # Callbacks
    checkpoint = ModelCheckpoint(str(checkpoint_path), 
                                 monitor='val_accuracy', 
                                 save_best_only=True, 
                                 mode='max',
                                 verbose=1)
    
    reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3, verbose=1)
    early_stop = EarlyStopping(monitor='val_loss', patience=7, restore_best_weights=True)

    # Train
    print("Starting training...")
    # STEPS LIMIT for Hackathon (approx 1000 images per class * 38 classes / 64 batch = ~600 steps)
    # This forces the epoch to finish "early" (Data Pruning via Iterator)
    hackathon_steps = 600 
    
    print(f"--- HACKATHON MODE: Limiting to {hackathon_steps} steps per epoch (approx 1000 imgs/class) ---")

    history = model.fit(
        train_generator,
        steps_per_epoch=hackathon_steps, # Force early finish
        validation_data=validation_generator,
        validation_steps=validation_generator.samples // BATCH_SIZE // 4, # Reduce validation time too
        epochs=EPOCHS,
        callbacks=[checkpoint, reduce_lr, early_stop]
    )
    
    # Fine-tuning (Optional but recommended)
    # Fine-tuning (SKIPPED FOR SPEED)
    print("Skipping Fine-tuning to save time...")
    # base_model.trainable = True
    # ... code commented out ...

    # Convert to TFLite
    print("Converting to TFLite...")
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    
    # Optimization (Quantization)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    
    # Representative Dataset for INT8 Quantization (Crucial for Mobile Accuracy/Speed)
    def representative_dataset_gen():
        for _ in range(100):
            img, _ = next(train_generator)
            # Yield the first image of the batch
            yield [img[0].reshape(1, IMG_SIZE, IMG_SIZE, 3).astype(np.float32)]

    converter.representative_dataset = representative_dataset_gen
    converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
    converter.inference_input_type = tf.float32 # Keep input float for easy app integration (normalization happens in app)
    converter.inference_output_type = tf.float32 
    
    tflite_model = converter.convert()

    tflite_path = assets_dir / "disease_detection.tflite"
    with open(tflite_path, 'wb') as f:
        f.write(tflite_model)
        
    print(f"Model saved to {tflite_path}")

if __name__ == "__main__":
    train_model()
