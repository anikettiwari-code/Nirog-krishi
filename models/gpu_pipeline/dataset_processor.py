"""
GPU-Accelerated Dataset Processor for Crop Disease Detection
Handles preprocessing of 400k+ crop images efficiently using GPU
"""

import tensorflow as tf
from pathlib import Path
from typing import Callable, Optional, List, Dict, Tuple
import numpy as np
import json
from datetime import datetime, timedelta
import time

class CropDiseaseDatasetProcessor:
    """
    Processes large datasets of crop images using GPU acceleration.
    Optimized for the Crop Disease Detection system.
    """
    
    def __init__(self, 
                 batch_size: int = 64,
                 target_size: Tuple[int, int] = (224, 224),
                 augmentation: bool = False):
        """
        Initialize the dataset processor.
        
        Args:
            batch_size: Number of images per batch (adjust based on GPU memory)
            target_size: Target image size (height, width)
            augmentation: Whether to apply data augmentation
        """
        self.batch_size = batch_size
        self.target_size = target_size
        self.augmentation = augmentation
        
        # Statistics
        self.stats = {
            'total_images': 0,
            'processed_images': 0,
            'failed_images': 0,
            'processing_time': 0,
            'images_per_second': 0
        }
    
    def load_and_preprocess(self, filepath: tf.Tensor, label: Optional[tf.Tensor] = None):
        """
        Load and preprocess a single image.
        Optimized for crop/leaf images.
        """
        # Read file
        image = tf.io.read_file(filepath)
        
        # Decode image (handles JPG, PNG, etc.)
        image = tf.image.decode_image(image, channels=3, expand_animations=False)
        image.set_shape([None, None, 3])
        
        # Resize to target size
        image = tf.image.resize(image, self.target_size)
        
        # Apply augmentation if enabled
        if self.augmentation:
            image = self._augment_image(image)
        
        # Normalize to [0, 1] for MobileNet/EfficientNet
        image = image / 255.0
        
        if label is not None:
            return image, label
        return image, filepath
    
    def _augment_image(self, image: tf.Tensor) -> tf.Tensor:
        """Apply data augmentation for crop disease detection."""
        # Random flip (horizontal only - vertical flip doesn't make sense for leaves)
        image = tf.image.random_flip_left_right(image)
        # Random brightness (simulates different lighting conditions)
        image = tf.image.random_brightness(image, max_delta=0.2)
        # Random contrast
        image = tf.image.random_contrast(image, lower=0.8, upper=1.2)
        # Random saturation (important for disease color detection)
        image = tf.image.random_saturation(image, lower=0.8, upper=1.2)
        # Ensure values are still in valid range
        image = tf.clip_by_value(image, 0.0, 1.0)
        return image
    
    def create_dataset_from_directory(self, 
                                     image_dir: str,
                                     labels: Optional[Dict[str, int]] = None,
                                     shuffle: bool = True) -> tf.data.Dataset:
        """Create TensorFlow dataset from directory of images."""
        all_paths = self._find_images(image_dir)
        
        # Filter paths if labels map is provided (Critical for Train/Val split)
        if labels is not None:
             image_paths = [p for p in all_paths if p.name in labels]
             print(f"Filtered dataset: {len(image_paths)} images (from {len(all_paths)} total in dir)")
        else:
             image_paths = all_paths
             
        self.stats['total_images'] = len(image_paths)
        
        if len(image_paths) == 0:
            raise ValueError(f"No images found in {image_dir} matching provided labels")
        
        path_strings = [str(p) for p in image_paths]
        
        if labels:
            label_list = [labels[p.name] for p in image_paths]
            dataset = tf.data.Dataset.from_tensor_slices((path_strings, label_list))
        else:
            dataset = tf.data.Dataset.from_tensor_slices(path_strings)
            label_list = None
        
        if shuffle:
            dataset = dataset.shuffle(buffer_size=min(10000, len(image_paths)))
        
        dataset = dataset.map(
            lambda x, y=None: self.load_and_preprocess(x, y) if label_list else self.load_and_preprocess(x),
            num_parallel_calls=tf.data.AUTOTUNE
        )
        
        dataset = dataset.batch(self.batch_size)
        dataset = dataset.prefetch(tf.data.AUTOTUNE)
        
        return dataset
    
    def _find_images(self, image_dir: str) -> List[Path]:
        """Find all image files in directory"""
        extensions = ['*.jpg', '*.jpeg', '*.png', '*.JPG', '*.JPEG', '*.PNG']
        image_paths = []
        img_dir = Path(image_dir)
        for ext in extensions:
            image_paths.extend(list(img_dir.rglob(ext)))
        return sorted(image_paths)

    def process_and_save_tfrecords(self, image_dir: str, output_dir: str, samples_per_file: int = 5000, labels_map: Optional[Dict[str, int]] = None):
        """Process images and save as TFRecord files for efficient training."""
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        image_paths = self._find_images(image_dir)
        total_images = len(image_paths)
        
        print(f"\nConverting {total_images} images to TFRecord format...")
        dataset = self.create_dataset_from_directory(image_dir, labels_map, shuffle=False)
        
        start_time = time.time()
        file_count = 0
        sample_count = 0
        writer = None
        
        for batch_images, batch_paths in dataset:
            for image, path in zip(batch_images.numpy(), batch_paths.numpy()):
                if sample_count % samples_per_file == 0:
                    if writer: writer.close()
                    file_count += 1
                    tfrecord_path = output_path / f"crops_{file_count:04d}.tfrecord"
                    writer = tf.io.TFRecordWriter(str(tfrecord_path))
                    print(f"Writing {tfrecord_path.name}...")
                
                example = self._create_tfrecord_example(image, path, labels_map)
                writer.write(example.SerializeToString())
                sample_count += 1
                
                if sample_count % 10000 == 0:
                    print(f"  Processed {sample_count}/{total_images} images")
        
        if writer: writer.close()
        print(f"\n✓ TFRecord conversion complete! Total files: {file_count}")

    def _create_tfrecord_example(self, image, path, labels_map=None):
        path_str = path.decode('utf-8') if isinstance(path, bytes) else str(path)
        image_bytes = tf.io.encode_jpeg((image * 255).astype(np.uint8)).numpy()
        feature = {
            'image': tf.train.Feature(bytes_list=tf.train.BytesList(value=[image_bytes])),
            'path': tf.train.Feature(bytes_list=tf.train.BytesList(value=[path_str.encode()]))
        }
        if labels_map:
            filename = Path(path_str).name
            label = labels_map.get(filename, 0)
            feature['label'] = tf.train.Feature(int64_list=tf.train.Int64List(value=[label]))
        return tf.train.Example(features=tf.train.Features(feature=feature))

    def process_with_model(self, image_dir: str, model: tf.keras.Model, output_file: str = "predictions.json", save_embeddings: bool = False):
        """Process images with a trained model (inference)."""
        dataset = self.create_dataset_from_directory(image_dir, shuffle=False)
        results = []
        print(f"\nRunning inference on images from {image_dir}...")
        
        for batch_images, batch_paths in dataset:
            if save_embeddings:
                embedding_model = tf.keras.Model(inputs=model.input, outputs=model.layers[-2].output)
                predictions = embedding_model.predict(batch_images, verbose=0)
            else:
                predictions = model.predict(batch_images, verbose=0)
            
            for path, pred in zip(batch_paths.numpy(), predictions):
                path_str = path.decode('utf-8') if isinstance(path, bytes) else str(path)
                results.append({
                    'image': Path(path_str).name,
                    'prediction': pred.tolist() if isinstance(pred, np.ndarray) else float(pred)
                })
        
        with open(output_file, 'w') as f:
            json.dump(results, f, indent=2)
        print(f"✓ Inference complete! Results saved to: {output_file}")

def load_tfrecord_dataset(tfrecord_dir: str, 
                          batch_size: int = 64,
                          shuffle: bool = True,
                          buffer_size: int = 10000) -> tf.data.Dataset:
    """Load and parse TFRecord dataset."""
    tfrecord_files = list(Path(tfrecord_dir).glob("*.tfrecord"))
    if not tfrecord_files:
        raise ValueError(f"No .tfrecord files found in {tfrecord_dir}")
        
    dataset = tf.data.TFRecordDataset([str(f) for f in tfrecord_files])
    
    def parse_example(example_proto):
        feature_description = {
            'image': tf.io.FixedLenFeature([], tf.string),
            'path': tf.io.FixedLenFeature([], tf.string),
            'label': tf.io.FixedLenFeature([], tf.int64, default_value=0)
        }
        parsed = tf.io.parse_single_example(example_proto, feature_description)
        image = tf.io.decode_jpeg(parsed['image'], channels=3)
        image = tf.cast(image, tf.float32) / 255.0
        label = parsed['label']
        return image, label
    
    dataset = dataset.map(parse_example, num_parallel_calls=tf.data.AUTOTUNE)
    if shuffle:
        dataset = dataset.shuffle(buffer_size)
    dataset = dataset.batch(batch_size).prefetch(tf.data.AUTOTUNE)
    return dataset
