# Crop Disease Detection - GPU Training System

Complete GPU-accelerated training pipeline for your Crop Disease Detection project. Optimized for processing 400k+ images efficiently using TensorFlow and CUDA 12.4.

## 🚀 Features

- **GPU-Accelerated Processing**: Up to 20x faster than CPU
- **Batch Processing**: Efficiently handle 400k+ images
- **TFRecord Conversion**: 10-20x faster training with optimized data format
- **Multiple Model Architectures**: MobileNetV3, EfficientNet, Custom CNN
- **Mobile Deployment**: Automatic TFLite conversion with INT8 quantization
- **Mixed Precision Training**: 2x faster on RTX GPUs
- **Progress Tracking**: Real-time speed and ETA monitoring

## 📋 Requirements

### Hardware
- NVIDIA GPU with CUDA support (you have RTX 4050 ✓)
- At least 6GB GPU memory (you have 6GB ✓)
- CUDA 12.4 installed (you have this ✓)

### Software
- Python 3.8+
- CUDA 12.4 (already installed)
- NVIDIA drivers 580.97+ (you have 580.97 ✓)

## 🔧 Installation

### Step 1: Create Virtual Environment

```bash
# Create environment
python -m venv tf_gpu_env

# Activate (Windows)
tf_gpu_env\Scripts\activate

# Activate (Linux/Mac)
source tf_gpu_env/bin/activate
```

### Step 2: Install Dependencies

```bash
# Upgrade pip
python -m pip install --upgrade pip

# Install TensorFlow and CUDA libraries
pip install -r requirements.txt
```

### Step 3: Verify Installation

```bash
# Test GPU setup
python gpu_utils.py
```

Expected output:
```
✓ GPU configured successfully: 1 GPU(s) available
✓ GPU computation test PASSED
```

## 📁 Project Structure

```
crop-disease-detection/
├── gpu_utils.py              # GPU configuration utilities
├── dataset_processor.py      # Image processing with GPU
├── train_model.py           # Model training pipeline
├── main.py                  # Interactive main script
├── requirements.txt         # Python dependencies
├── README.md               # This file
│
├── data/                   # Your raw images (create this)
│   ├── healthy/
│   ├── rust/
│   ├── blight/
│   └── ...
│
├── prepared_data/          # TFRecord files (auto-generated)
│   ├── train/
│   └── val/
│
└── models/                 # Trained models (auto-generated)
    ├── *.keras             # Keras models
    └── *.tflite           # TFLite models for Android
```

## 🎯 Quick Start

### Option 1: Interactive Menu (Recommended)

```bash
python main.py
```

This will guide you through:
1. Environment check
2. Image processing
3. Model training
4. TFLite conversion

### Option 2: Direct Training

```python
from gpu_utils import setup_gpu
from train_model import prepare_training_data, CropDiseaseModel

# Setup GPU
setup_gpu(memory_growth=True)

# Prepare data
train_ds, val_ds, num_classes, class_names = prepare_training_data(
    raw_data_dir="data/",
    output_dir="prepared_data",
    val_split=0.2,
    batch_size=64
)

# Create and train model
model = CropDiseaseModel(
    num_classes=num_classes,
    model_type='mobilenetv3',
    use_mixed_precision=True
)

model.build_model(pretrained=True)
model.compile_model(learning_rate=0.001)

model.train(
    train_dataset=train_ds,
    val_dataset=val_ds,
    epochs=20,
    output_dir='models'
)

# Convert for Android
model.convert_to_tflite(
    output_path='models/crop_disease.tflite',
    quantize=True
)
```

## 📊 Processing 400k Images

### Batch Processing (Inference)

```python
from dataset_processor import CropDiseaseDatasetProcessor

processor = CropDiseaseDatasetProcessor(
    batch_size=64,
    target_size=(224, 224)
)

dataset = processor.create_dataset_from_directory("path/to/400k/images")

for batch_images, batch_paths in dataset:
    # Your processing logic
    predictions = model.predict(batch_images)
```

**Expected Performance:**
- Loading + Preprocessing: 500-1000 images/second
- With inference: 200-500 images/second
- Total time for 400k images: 7-20 minutes

### Convert to TFRecord (Recommended for Training)

```python
processor = CropDiseaseDatasetProcessor(batch_size=64)

processor.process_and_save_tfrecords(
    image_dir="path/to/400k/images",
    output_dir="prepared_data",
    samples_per_file=5000
)
```

This will:
- Convert all images to optimized TFRecord format
- Split into manageable files (5000 images each)
- Speed up training by 10-20x

## 🎓 Training Models

### Model Options

1. **MobileNetV3** (Recommended)
   - Best for mobile deployment
   - Model size: ~5-10 MB (quantized)
   - Inference speed: <100ms on phone
   - Use for: Production Android app

2. **EfficientNet**
   - Better accuracy
   - Model size: ~15-20 MB
   - Use for: When accuracy is critical

3. **Custom CNN**
   - Smallest model
   - Train from scratch
   - Use for: Limited data scenarios

### Training Configuration

```python
model = CropDiseaseModel(
    num_classes=10,  # Number of disease classes
    model_type='mobilenetv3',
    use_mixed_precision=True  # 2x faster on RTX GPUs
)
```

### Training Tips

1. **Batch Size**
   - RTX 4050 (6GB): Use 64-128
   - If OOM error: Reduce to 32
   - Larger batch = faster training

2. **Mixed Precision**
   - Automatically enabled
   - 2x faster training
   - No accuracy loss

3. **Data Augmentation**
   - Enabled by default
   - Improves generalization
   - Prevents overfitting

## 📱 Android Deployment

After training, you'll get a `.tflite` file:

```
models/crop_disease_model.tflite  (~5-10 MB)
```

### Integration Steps

1. **Copy to Android project:**
   ```
   app/src/main/assets/crop_disease_model.tflite
   ```

2. **Load in Android:**
   ```kotlin
   val interpreter = Interpreter(loadModelFile())
   
   fun loadModelFile(): MappedByteBuffer {
       val fileDescriptor = assets.openFd("crop_disease_model.tflite")
       val inputStream = FileInputStream(fileDescriptor.fileDescriptor)
       val fileChannel = inputStream.channel
       return fileChannel.map(
           FileChannel.MapMode.READ_ONLY,
           fileDescriptor.startOffset,
           fileDescriptor.declaredLength
       )
   }
   ```

3. **Run inference:**
   ```kotlin
   val input = preprocessImage(bitmap)  // [1, 224, 224, 3]
   val output = Array(1) { FloatArray(numClasses) }
   interpreter.run(input, output)
   ```

## 🔍 Monitoring Training

### TensorBoard

```bash
# Start TensorBoard
tensorboard --logdir models/logs

# Open browser to http://localhost:6006
```

### GPU Monitoring

```bash
# Real-time GPU usage
nvidia-smi -l 1
```

Watch for:
- **GPU Utilization**: Should be 80-100% during training
- **GPU Memory**: Should use 4-5GB (out of 6GB)
- **Temperature**: Should stay below 80°C

## ⚡ Performance Optimization

### For RTX 4050 (6GB)

```python
# Optimal settings
setup_gpu(
    memory_growth=True,      # Prevents OOM
    memory_limit=5000        # Leave 1GB for system
)

processor = CropDiseaseDatasetProcessor(
    batch_size=64,           # Sweet spot for 6GB
    target_size=(224, 224),
    augmentation=True
)
```

### Expected Speeds

| Task | Images/Second | Time for 400k |
|------|--------------|---------------|
| Loading only | 800-1000 | 7-8 min |
| + Preprocessing | 500-700 | 10-13 min |
| + Inference (MobileNet) | 200-400 | 17-33 min |
| Training (per epoch) | 150-300 | 22-44 min |

## 🐛 Troubleshooting

### GPU Not Detected

```bash
# Check CUDA installation
nvcc --version

# Check driver
nvidia-smi

# Reinstall TensorFlow
pip uninstall tensorflow
pip install tensorflow==2.16.1
pip install nvidia-cudnn-cu12
```

### Out of Memory (OOM)

```python
# Reduce batch size
batch_size=32  # Instead of 64

# Or limit GPU memory
setup_gpu(memory_limit=4000)
```

### Slow Training

1. Check GPU utilization: `nvidia-smi`
2. Enable mixed precision
3. Use TFRecord format
4. Increase batch size if memory allows

### Import Errors

```bash
# Make sure you're in virtual environment
tf_gpu_env\Scripts\activate

# Reinstall requirements
pip install -r requirements.txt --force-reinstall
```

## 📚 Example Workflows

### Workflow 1: Quick Test (Small Dataset)

```bash
python main.py
# Choose option 3
# Train for 5 epochs to test
```

### Workflow 2: Full Training (400k Images)

```bash
# Step 1: Convert to TFRecord
python main.py  # Choose option 2

# Step 2: Train model
python main.py  # Choose option 3

# Step 3: Deploy to Android
# Use the .tflite file from models/
```

### Workflow 3: Inference Only

```bash
# If you already have a trained model
python main.py  # Choose option 4
```

## 🎯 Integration with Your Project

### Adding to Existing Project

1. Copy these files to your project:
   ```
   gpu_utils.py
   dataset_processor.py
   train_model.py
   ```

2. Import in your code:
   ```python
   from gpu_utils import setup_gpu
   from dataset_processor import CropDiseaseDatasetProcessor
   ```

3. Use in your existing pipeline:
   ```python
   # At the start of your training script
   setup_gpu(memory_growth=True)
   
   # Replace your data loading
   processor = CropDiseaseDatasetProcessor(batch_size=64)
   dataset = processor.create_dataset_from_directory("data/")
   ```

## 💡 Advanced Features

### Multi-Modal Input (Image + Weather)

```python
def load_with_metadata(filepath, temperature, humidity):
    image = load_and_preprocess(filepath)
    # Concatenate weather data
    metadata = tf.constant([temperature, humidity])
    return image, metadata

# Use in model
inputs_img = keras.Input(shape=(224, 224, 3))
inputs_meta = keras.Input(shape=(2,))
# Combine in model architecture
```

### Custom Augmentation

```python
processor = CropDiseaseDatasetProcessor(augmentation=True)

# Customize augmentation
def custom_augment(image):
    # Add your custom augmentation
    return image
```

## 📞 Support

If you encounter issues:

1. Check GPU status: `python gpu_utils.py`
2. Check this README
3. Check error messages carefully
4. Reduce batch size if OOM

## 🎉 Next Steps

After training:

1. ✅ Test model accuracy on validation set
2. ✅ Convert to TFLite
3. ✅ Integrate with Android app
4. ✅ Test on real crop images
5. ✅ Deploy to production

## 📄 License

Part of the Crop Disease Detection System project.
