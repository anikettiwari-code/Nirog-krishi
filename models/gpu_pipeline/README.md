# Crop Disease Detection - GPU Training System

Complete GPU-accelerated training pipeline for your Crop Disease Detection project. Optimized for processing 400k+ images efficiently using TensorFlow and CUDA 12.4.

> **🪟 Windows Users:** See [WINDOWS_GUIDE.md](WINDOWS_GUIDE.md) for Windows-specific instructions and batch scripts!

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

### Step 1: Create Virtual Environment (Windows)

```cmd
# Create environment
python -m venv tf_gpu_env

# Activate (Windows Command Prompt)
tf_gpu_env\Scripts\activate

# Or if using PowerShell
tf_gpu_env\Scripts\Activate.ps1
```

### Step 2: Install Dependencies

```cmd
# Upgrade pip
python -m pip install --upgrade pip

# Install TensorFlow and CUDA libraries
pip install -r requirements.txt
```

### Step 3: Verify Installation

```cmd
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

```cmd
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

# Prepare data (use Windows paths with r"" or double backslashes)
train_ds, val_ds, num_classes, class_names = prepare_training_data(
    raw_data_dir=r"C:\Users\YourName\data",  # Windows path
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
