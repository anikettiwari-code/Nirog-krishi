"""
Model Training Script for Crop Disease Detection
Optimized for GPU training with TensorFlow
"""

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models
from tensorflow.keras.applications import (
    MobileNetV3Small, MobileNetV3Large, EfficientNetB0, EfficientNetB1
)
import os
from pathlib import Path
from datetime import datetime
from typing import Tuple, Optional, Dict
import json

from gpu_utils import setup_gpu, enable_mixed_precision
from dataset_processor import CropDiseaseDatasetProcessor

class CropDiseaseModel:
    """Wrapper for training crop disease detection models."""
    
    def __init__(self, num_classes: int, input_shape: Tuple[int, int, int] = (224, 224, 3), model_type: str = 'mobilenetv3', use_mixed_precision: bool = True):
        self.num_classes = num_classes
        self.input_shape = input_shape
        self.model_type = model_type
        self.model = None
        setup_gpu(memory_growth=True)
        if use_mixed_precision: enable_mixed_precision()
    
    def build_model(self, pretrained: bool = True) -> keras.Model:
        print(f"\nBuilding {self.model_type} model...")
        if self.model_type == 'mobilenetv3': self.model = self._build_mobilenetv3(pretrained)
        elif self.model_type == 'efficientnet': self.model = self._build_efficientnet(pretrained)
        elif self.model_type == 'custom': self.model = self._build_custom_cnn()
        else: raise ValueError(f"Unknown model type: {self.model_type}")
        print(f"✓ Model built successfully. Parameters: {self.model.count_params():,}")
        return self.model
    
    def _build_mobilenetv3(self, pretrained: bool) -> keras.Model:
        weights = 'imagenet' if pretrained else None
        base_model = MobileNetV3Large(input_shape=self.input_shape, include_top=False, weights=weights, pooling='avg')
        base_model.trainable = False
        inputs = keras.Input(shape=self.input_shape)
        x = base_model(inputs, training=False)
        x = layers.Dropout(0.2)(x)
        outputs = layers.Dense(self.num_classes, activation='softmax', dtype='float32')(x)
        return keras.Model(inputs, outputs, name='CropDisease_MobileNetV3')

    def _build_efficientnet(self, pretrained: bool) -> keras.Model:
        weights = 'imagenet' if pretrained else None
        base_model = EfficientNetB0(input_shape=self.input_shape, include_top=False, weights=weights, pooling='avg')
        base_model.trainable = False
        inputs = keras.Input(shape=self.input_shape)
        x = base_model(inputs, training=False)
        x = layers.Dropout(0.2)(x)
        outputs = layers.Dense(self.num_classes, activation='softmax', dtype='float32')(x)
        return keras.Model(inputs, outputs, name='CropDisease_EfficientNet')
        
    def _build_custom_cnn(self) -> keras.Model:
        inputs = keras.Input(shape=self.input_shape)
        x = layers.Conv2D(32, 3, strides=2, padding='same')(inputs)
        x = layers.BatchNormalization()(x); x = layers.ReLU()(x)
        x = layers.Conv2D(64, 3, padding='same')(x)
        x = layers.BatchNormalization()(x); x = layers.ReLU()(x); x = layers.MaxPooling2D(2)(x)
        x = layers.Conv2D(128, 3, padding='same')(x)
        x = layers.BatchNormalization()(x); x = layers.ReLU()(x); x = layers.MaxPooling2D(2)(x)
        x = layers.GlobalAveragePooling2D()(x)
        x = layers.Dropout(0.3)(x)
        outputs = layers.Dense(self.num_classes, activation='softmax', dtype='float32')(x)
        return keras.Model(inputs, outputs, name='CropDisease_CustomCNN')

    def compile_model(self, learning_rate: float = 0.001, optimizer: str = 'adam'):
        if self.model is None: raise ValueError("Model not built.")
        opt = keras.optimizers.Adam(learning_rate=learning_rate) if optimizer == 'adam' else keras.optimizers.SGD(learning_rate=learning_rate, momentum=0.9)
        self.model.compile(optimizer=opt, loss='sparse_categorical_crossentropy', metrics=['accuracy', keras.metrics.TopKCategoricalAccuracy(k=3, name='top3_accuracy')])
        print(f"✓ Model compiled with {optimizer} optimizer")

    def train(self, train_dataset, val_dataset, epochs=20, output_dir='models', fine_tune_at=10):
        output_path = Path(output_dir); output_path.mkdir(parents=True, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        model_name = f"crop_disease_{self.model_type}_{timestamp}"
        
        callbacks = [
            keras.callbacks.ModelCheckpoint(str(output_path / f"{model_name}_best.keras"), monitor='val_accuracy', save_best_only=True, mode='max', verbose=1),
            keras.callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3, verbose=1),
            keras.callbacks.EarlyStopping(monitor='val_accuracy', patience=5, restore_best_weights=True, verbose=1),
            keras.callbacks.TensorBoard(log_dir=str(output_path / 'logs' / model_name))
        ]
        
        history = self.model.fit(train_dataset, validation_data=val_dataset, epochs=fine_tune_at, callbacks=callbacks)
        
        if fine_tune_at < epochs:
            print(f"\nPhase 2: Fine-tuning entire model...")
            self.model.trainable = True
            self.model.compile(optimizer=keras.optimizers.Adam(learning_rate=1e-5), loss='sparse_categorical_crossentropy', metrics=['accuracy'])
            history_fine = self.model.fit(train_dataset, validation_data=val_dataset, initial_epoch=fine_tune_at, epochs=epochs, callbacks=callbacks)
            for k in history.history: history.history[k].extend(history_fine.history[k])
            
        final_model_path = output_path / f"{model_name}_final.keras"
        self.model.save(final_model_path)
        print(f"\n✓ Training complete! Saved to {final_model_path}")
        return history

    def convert_to_tflite(self, output_path: str, quantize: bool = True):
        converter = tf.lite.TFLiteConverter.from_keras_model(self.model)
        if quantize:
            converter.optimizations = [tf.lite.Optimize.DEFAULT]
            converter.target_spec.supported_types = [tf.int8]
        tflite_model = converter.convert()
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'wb') as f: f.write(tflite_model)
        print(f"✓ TFLite model saved to: {output_path}")

def prepare_training_data(raw_data_dir: str, output_dir: str, val_split: float = 0.2, batch_size: int = 64):
    print(f"Preparing training data from {raw_data_dir}...")
    processor = CropDiseaseDatasetProcessor(batch_size=batch_size, augmentation=True)
    class_folders = sorted([d for d in Path(raw_data_dir).iterdir() if d.is_dir()])
    class_names = [f.name for f in class_folders]
    labels_map = {}
    for i, folder in enumerate(class_folders):
        for img in folder.glob('*.*'): labels_map[img.name] = i
        
    all_files = list(labels_map.keys())
    import random; random.shuffle(all_files)
    split_idx = int(len(all_files) * (1 - val_split))
    train_files = all_files[:split_idx]; val_files = all_files[split_idx:]
    
    train_output = Path(output_dir) / 'train'
    val_output = Path(output_dir) / 'val'
    processor.process_and_save_tfrecords(raw_data_dir, str(train_output), labels_map={f: labels_map[f] for f in train_files})
    processor.process_and_save_tfrecords(raw_data_dir, str(val_output), labels_map={f: labels_map[f] for f in val_files})
    
    train_ds = load_tfrecord_dataset(str(train_output), batch_size=batch_size, shuffle=True)
    val_ds = load_tfrecord_dataset(str(val_output), batch_size=batch_size, shuffle=False)
    
    return train_ds, val_ds, len(class_names), class_names

def load_tfrecord_dataset(tfrecord_dir, batch_size=64, shuffle=True):
    # Proxy to dataset_processor's method or reimplement if independent
    from dataset_processor import load_tfrecord_dataset as load_tf
    return load_tf(tfrecord_dir, batch_size, shuffle)
