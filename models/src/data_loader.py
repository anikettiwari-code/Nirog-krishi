import tensorflow as tf
import pathlib
import os

IMG_HEIGHT = 224
IMG_WIDTH = 224
BATCH_SIZE = 32

def load_data(data_dir):
    """
    Loads data from the specified directory and returns train and validation datasets.
    
    Args:
        data_dir (str): Path to the dataset directory (e.g., 'models/datasets/raw')
    
    Returns:
        train_ds, val_ds: TensorFlow Dataset objects
        class_names: List of class names
    """
    data_dir = pathlib.Path(data_dir)
    image_count = len(list(data_dir.glob('*/*.jpg')))
    print(f"Found {image_count} images in {data_dir}")

    # Create datasets
    train_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=0.2,
        subset="training",
        seed=123,
        image_size=(IMG_HEIGHT, IMG_WIDTH),
        batch_size=BATCH_SIZE
    )

    val_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=0.2,
        subset="validation",
        seed=123,
        image_size=(IMG_HEIGHT, IMG_WIDTH),
        batch_size=BATCH_SIZE
    )

    class_names = train_ds.class_names
    print(f"Classes found: {class_names}")

    # Data Augmentation Layer
    data_augmentation = tf.keras.Sequential([
        tf.keras.layers.RandomFlip("horizontal_and_vertical"),
        tf.keras.layers.RandomRotation(0.2),
        tf.keras.layers.RandomZoom(0.2),
        tf.keras.layers.RandomContrast(0.2),
        tf.keras.layers.RandomBrightness(0.2),
    ])

    # Apply optimization
    AUTOTUNE = tf.data.AUTOTUNE
    
    # Apply augmentation only to training set
    train_ds = train_ds.map(lambda x, y: (data_augmentation(x, training=True), y), 
                            num_parallel_calls=AUTOTUNE)

    train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

    return train_ds, val_ds, class_names
