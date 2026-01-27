"""
Quick Start Script - Test GPU Setup Immediately
Run this first to make sure everything works!
"""

import sys
from pathlib import Path

def test_imports():
    """Test if all required packages are installed"""
    print("Testing package imports...")
    print("-" * 60)
    
    required_packages = {
        'tensorflow': 'TensorFlow',
        'numpy': 'NumPy',
        'PIL': 'Pillow',
    }
    
    missing = []
    for package, name in required_packages.items():
        try:
            __import__(package)
            print(f"✓ {name}")
        except ImportError:
            print(f"✗ {name} - NOT INSTALLED")
            missing.append(name)
    
    if missing:
        print(f"\n❌ Missing packages: {', '.join(missing)}")
        print("\nInstall missing packages:")
        print("  pip install -r requirements.txt")
        return False
    
    print("\n✓ All packages installed!")
    return True


def test_tensorflow_gpu():
    """Test TensorFlow GPU configuration"""
    print("\n" + "=" * 60)
    print("Testing TensorFlow GPU Setup")
    print("=" * 60)
    
    try:
        import tensorflow as tf
        
        print(f"\nTensorFlow version: {tf.__version__}")
        print(f"Built with CUDA: {tf.test.is_built_with_cuda()}")
        
        # Check GPUs
        gpus = tf.config.list_physical_devices('GPU')
        print(f"\nGPUs detected: {len(gpus)}")
        
        if gpus:
            print("\n✓ GPU Details:")
            for i, gpu in enumerate(gpus):
                print(f"  GPU {i}: {gpu.name}")
                try:
                    details = tf.config.experimental.get_device_details(gpu)
                    device_name = details.get('device_name', 'Unknown')
                    print(f"    Device: {device_name}")
                except:
                    pass
            
            # Test computation
            print("\nTesting GPU computation...")
            try:
                with tf.device('/GPU:0'):
                    a = tf.random.normal([1000, 1000])
                    b = tf.random.normal([1000, 1000])
                    c = tf.matmul(a, b)
                print("✓ GPU computation successful!")
                return True
            except Exception as e:
                print(f"✗ GPU computation failed: {e}")
                return False
        else:
            print("\n❌ No GPU detected!")
            print("\nPossible reasons:")
            print("  1. NVIDIA drivers not installed")
            print("  2. CUDA not installed (you should have CUDA 12.4)")
            print("  3. TensorFlow not configured for GPU")
            print("\nCheck your installation:")
            print("  1. Run: nvidia-smi")
            print("  2. Run: nvcc --version")
            print("  3. Reinstall: pip install tensorflow==2.16.1")
            return False
            
    except Exception as e:
        print(f"\n❌ Error: {e}")
        return False


def estimate_performance():
    """Estimate performance for 400k images"""
    print("\n" + "=" * 60)
    print("Expected Performance for 400k Images")
    print("=" * 60)
    
    print("\nWith your RTX 4050 GPU:")
    print("\n1. Image Loading + Preprocessing:")
    print("   Speed: ~500-800 images/second")
    print("   Time for 400k images: 8-13 minutes")
    
    print("\n2. Model Inference (MobileNetV3):")
    print("   Speed: ~200-400 images/second")
    print("   Time for 400k images: 17-33 minutes")
    
    print("\n3. Model Training:")
    print("   Speed: ~150-300 images/second per epoch")
    print("   Time per epoch: 22-44 minutes")
    print("   Full training (20 epochs): 7-15 hours")
    
    print("\n4. TFRecord Conversion:")
    print("   Speed: ~400-600 images/second")
    print("   Time for 400k images: 11-17 minutes")
    print("   Benefit: 10-20x faster training after conversion!")


def create_test_script():
    """Create a simple test script for users"""
    print("\n" + "=" * 60)
    print("Creating Test Script")
    print("=" * 60)
    
    test_code = '''"""
Simple GPU Test - Place a few test images in a folder and run this
"""

from gpu_utils import setup_gpu, print_gpu_info
from dataset_processor import CropDiseaseDatasetProcessor
import time

# Setup GPU
print("Setting up GPU...")
setup_gpu(memory_growth=True)
print()

# Print GPU info
print_gpu_info()
print()

# Test with your images
IMAGE_DIR = input("Enter path to test images folder: ").strip()

processor = CropDiseaseDatasetProcessor(
    batch_size=32,
    target_size=(224, 224)
)

print(f"\\nProcessing images from: {IMAGE_DIR}")
print("This will load and preprocess all images using GPU...")
print()

start_time = time.time()
dataset = processor.create_dataset_from_directory(IMAGE_DIR, shuffle=False)

image_count = 0
for batch_images, batch_paths in dataset:
    image_count += len(batch_images)
    print(f"Processed batch: {len(batch_images)} images")

elapsed = time.time() - start_time
speed = image_count / elapsed if elapsed > 0 else 0

print(f"\\n✓ Test complete!")
print(f"  Total images: {image_count}")
print(f"  Time: {elapsed:.2f} seconds")
print(f"  Speed: {speed:.1f} images/second")
print(f"\\nFor 400,000 images, estimated time: {400000/speed/60:.1f} minutes")
'''
    
    with open('test_gpu_simple.py', 'w') as f:
        f.write(test_code)
    
    print("\n✓ Created test_gpu_simple.py")
    print("\nUsage:")
    print("  1. Put some test images in a folder")
    print("  2. Run: python test_gpu_simple.py")
    print("  3. Enter the folder path")


def show_next_steps():
    """Show what to do next"""
    print("\n" + "=" * 60)
    print("🎉 GPU Setup Complete! Next Steps:")
    print("=" * 60)
    
    print("\n1. Quick Test (Recommended):")
    print("   python test_gpu_simple.py")
    print("   → Test with a few images to verify speed")
    
    print("\n2. Interactive Menu:")
    print("   python main.py")
    print("   → Full training pipeline with guided setup")
    
    print("\n3. Process Your 400k Images:")
    print("   → Option A: Direct processing")
    print("   → Option B: Convert to TFRecord (recommended)")
    
    print("\n4. Train Your Model:")
    print("   → Use main.py option 3")
    print("   → Choose MobileNetV3 for mobile deployment")
    print("   → Train for 20 epochs (~7-15 hours)")
    
    print("\n5. Deploy to Android:")
    print("   → Get .tflite file from models/ folder")
    print("   → Copy to Android app assets")
    print("   → Use TFLite Interpreter for inference")
    
    print("\n" + "=" * 60)


def main():
    """Run all tests"""
    print("=" * 60)
    print("CROP DISEASE DETECTION - GPU SETUP TEST")
    print("=" * 60)
    
    # Test 1: Package imports
    if not test_imports():
        sys.exit(1)
    
    # Test 2: TensorFlow GPU
    if not test_tensorflow_gpu():
        sys.exit(1)
    
    # Show performance estimates
    estimate_performance()
    
    # Create test script
    create_test_script()
    
    # Show next steps
    show_next_steps()
    
    print("\n✓ All tests passed! You're ready to go!")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nInterrupted by user.")
    except Exception as e:
        print(f"\n\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
