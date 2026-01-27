import tensorflow as tf
import time

def check_gpu():
    print("--- TensorFlow GPU Verification ---")
    gpus = tf.config.list_physical_devices('GPU')
    if gpus:
        print(f"✓ GPU configured successfully: {len(gpus)} GPU(s) available")
        for gpu in gpus:
            print(f"  - {gpu}")
        
        # Simple computation test
        with tf.device('/GPU:0'):
            a = tf.constant([[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]])
            b = tf.constant([[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]])
            c = tf.matmul(a, b)
            print("✓ GPU computation test PASSED")
            print(f"Result matrix shape: {c.shape}")
    else:
        print("✗ No GPU detected. TensorFlow is running on CPU.")
        
    print(f"TensorFlow Version: {tf.__version__}")

if __name__ == "__main__":
    check_gpu()
