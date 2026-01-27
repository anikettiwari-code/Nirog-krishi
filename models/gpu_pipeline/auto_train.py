"""
Automated GPU Training Runner
Starts training immediately without menu interaction.
"""
import os
import sys
from pathlib import Path

# Add current dir to path to find modules
sys.path.append(os.path.dirname(__file__))

from gpu_utils import setup_gpu
from train_model import prepare_training_data, CropDiseaseModel

def run_auto_train():
    print("="*60)
    print("🚀 AUTOMATED GPU TRAINING START")
    print("="*60)

    # 1. Setup GPU
    print("\n[1/4] Initializing GPU...")
    setup_gpu(memory_growth=True)

    # 2. Paths
    # We use the raw dataset we already have
    dataset_dir = r"d:\Krishi_samridhi\models\datasets\raw"
    output_dir = r"d:\Krishi_samridhi\models\gpu_run_01"
    model_dir = r"d:\Krishi_samridhi\models\gpu_model_artifacts"
    
    # 3. Prepare Data
    print(f"\n[2/4] Preparing Data from: {dataset_dir}")
    # This converts to TFRecords automatically
    train_ds, val_ds, num_classes, class_names = prepare_training_data(
        raw_data_dir=dataset_dir,
        output_dir=output_dir,
        val_split=0.2,
        batch_size=32 # Safe for RTX 4050 6GB
    )
    print(f"      Classes found: {num_classes}")

    # 4. Build Model
    print(f"\n[3/4] Building MobileNetV3 (Transfer Learning)...")
    model = CropDiseaseModel(
        num_classes=num_classes,
        model_type='mobilenetv3',
        use_mixed_precision=True
    )
    model.build_model(pretrained=True)
    model.compile_model(learning_rate=0.001)

    # 5. Train
    print(f"\n[4/4] Starting Training Loop...")
    print("      Target: 10 Epochs (High Accuracy Mode)")
    model.train(
        train_dataset=train_ds,
        val_dataset=val_ds,
        epochs=10,
        output_dir=model_dir
    )
    
    # 6. Convert
    print(f"\n[Success] Converting to TFLite...")
    model.convert_to_tflite(os.path.join(model_dir, "gpu_model.tflite"))
    print("Done!")

if __name__ == "__main__":
    run_auto_train()
