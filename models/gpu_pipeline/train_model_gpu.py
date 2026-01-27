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

# Relative imports if in same package
try:
    from gpu_utils import setup_gpu, enable_mixed_precision
    from dataset_processor import CropDiseaseDatasetProcessor, load_tfrecord_dataset
except ImportError:
    # Handle direct script execution
    import sys
    sys.path.append(os.path.dirname(__file__))
    from dataset_processor import CropDiseaseDatasetProcessor, load_tfrecord_dataset

class CropDiseaseModel:
    def __init__(self,
                 num_classes: int,
                 input_shape: Tuple[int, int, int] = (224, 224, 3),
                 model_type: str = 'mobilenetv3',
                 use_mixed_precision: bool = True):
        self.num_classes = num_classes
        self.input_shape = input_shape
        self.model_type = model_type
        self.model = None
        
        # Mixed precision
        if use_mixed_precision:
            policy = keras.mixed_precision.Policy('mixed_float16')
            keras.mixed_precision.set_global_policy(policy)

    def build_model(self, pretrained: bool = True) -> keras.Model:
        if self.model_type == 'mobilenetv3':
            base_model = MobileNetV3Large(input_shape=self.input_shape, include_top=False, weights='imagenet', pooling='avg')
            base_model.trainable = False
            inputs = keras.Input(shape=self.input_shape)
            x = base_model(inputs, training=False)
            x = layers.Dropout(0.2)(x)
            outputs = layers.Dense(self.num_classes, activation='softmax', dtype='float32')(x)
            self.model = keras.Model(inputs, outputs)
        return self.model

    def train(self,
             train_dataset: tf.data.Dataset,
             val_dataset: tf.data.Dataset,
             epochs: int = 20,
             output_dir: str = 'models'):
        self.model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
        self.model.fit(train_dataset, validation_data=val_dataset, epochs=epochs)
        self.model.save(os.path.join(output_dir, "gpu_model_final.keras"))
