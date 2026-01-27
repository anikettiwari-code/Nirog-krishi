import tensorflow as tf

def setup_gpu(memory_growth=True):
    gpus = tf.config.list_physical_devices('GPU')
    if gpus:
        try:
            for gpu in gpus:
                if memory_growth: tf.config.experimental.set_memory_growth(gpu, True)
            print(f"✓ Memory growth enabled for {len(gpus)} GPUs")
            return True
        except RuntimeError as e: print(e)
    return False

def enable_mixed_precision():
    policy = tf.keras.mixed_precision.Policy('mixed_float16')
    tf.keras.mixed_precision.set_global_policy(policy)
    print("✓ Mixed precision (FP16) enabled")

def print_gpu_info():
    gpus = tf.config.list_physical_devices('GPU')
    print(f"TensorFlow Version: {tf.__version__}")
    print(f"GPUs Detected: {len(gpus)}")
    for gpu in gpus: print(f"  - {gpu}")

def test_gpu_computation():
    try:
        with tf.device('/GPU:0'):
            a = tf.random.normal([1000, 1000])
            b = tf.random.normal([1000, 1000])
            c = tf.matmul(a, b)
        print("✓ GPU computation test PASSED")
        return True
    except Exception as e:
        print(f"✗ GPU computation failed: {e}")
        return False
