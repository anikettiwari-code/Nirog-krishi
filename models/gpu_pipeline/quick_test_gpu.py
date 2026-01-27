"""
Quick Start Script - Test GPU Setup Immediately
"""
import tensorflow as tf
import os

def test_gpu():
    print("=" * 60)
    print("Checking TensorFlow GPU Setup")
    print("=" * 60)
    
    gpus = tf.config.list_physical_devices('GPU')
    print(f"GPUs detected: {len(gpus)}")
    
    if gpus:
        for i, gpu in enumerate(gpus):
            print(f"  GPU {i}: {gpu}")
        
        print("\nRunning computation test...")
        with tf.device('/GPU:0'):
            a = tf.random.normal([1000, 1000])
            b = tf.random.normal([1000, 1000])
            c = tf.matmul(a, b)
        print("✓ GPU computation successful!")
    else:
        print("\n✗ No GPU detected. Running on CPU.")

if __name__ == "__main__":
    test_gpu()
