import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV3Small
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping
import os
import pathlib
import numpy as np

# Config
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 10 
LEARNING_RATE = 1e-4

def train_leaf_check():
    current_file = pathlib.Path(__file__)
    project_root = current_file.parent.parent # models/
    data_dir = project_root / "datasets" / "leaf_check" # Has 'leaf' and 'random' folders
    assets_dir = project_root / "assets"
    
    if not assets_dir.exists():
        os.makedirs(assets_dir, exist_ok=True)

    print(f"Loading data from: {data_dir}")

    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=40,
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
        class_mode='binary', # Leaf vs Random
        subset='training',
        shuffle=True
    )

    validation_generator = train_datagen.flow_from_directory(
        data_dir,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='binary',
        subset='validation',
        shuffle=False
    )

    print(f"Classes: {train_generator.class_indices}")

    # Model Architecture (MobileNetV3Small - Ultra lightweight)
    base_model = MobileNetV3Small(weights='imagenet', include_top=False, input_shape=(IMG_SIZE, IMG_SIZE, 3))
    base_model.trainable = False 

    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.2)(x)
    predictions = Dense(1, activation='sigmoid')(x) # Binary output

    model = Model(inputs=base_model.input, outputs=predictions)

    model.compile(optimizer=Adam(learning_rate=LEARNING_RATE),
                  loss='binary_crossentropy',
                  metrics=['accuracy'])

    history = model.fit(
        train_generator,
        steps_per_epoch=train_generator.samples // BATCH_SIZE,
        validation_data=validation_generator,
        validation_steps=validation_generator.samples // BATCH_SIZE,
        epochs=EPOCHS,
        callbacks=[
            EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)
        ]
    )

    # Convert to TFLite
    print("Converting to TFLite...")
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    
    # Representative Dataset
    def representative_dataset_gen():
        for _ in range(50):
            img, _ = next(train_generator)
            yield [img[0].reshape(1, IMG_SIZE, IMG_SIZE, 3).astype(np.float32)]

    converter.representative_dataset = representative_dataset_gen
    converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
    converter.inference_input_type = tf.float32
    converter.inference_output_type = tf.float32 
    
    tflite_model = converter.convert()

    tflite_path = assets_dir / "leaf_check.tflite"
    with open(tflite_path, 'wb') as f:
        f.write(tflite_model)
        
    print(f"Model saved to {tflite_path}")

if __name__ == "__main__":
    train_leaf_check()
