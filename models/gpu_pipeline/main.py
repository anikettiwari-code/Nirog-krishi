"""
Main Script for Crop Disease Detection GPU Training
Complete workflow for processing 400k images and training models
"""

import os
import sys
from pathlib import Path
from gpu_utils import setup_gpu, print_gpu_info, test_gpu_computation
from dataset_processor import CropDiseaseDatasetProcessor
from train_model import CropDiseaseModel, prepare_training_data

def check_environment():
    print("=" * 70); print("ENVIRONMENT CHECK"); print("=" * 70)
    print("\n1. Checking GPU availability..."); print_gpu_info()
    has_gpu = setup_gpu(memory_growth=True)
    if has_gpu:
        print("\n2. Testing GPU computation..."); test_gpu_computation()
    else:
        print("\n⚠ WARNING: No GPU detected!"); print("Training will be VERY slow on CPU.")
    return has_gpu

def main():
    has_gpu = check_environment()
    while True:
        print("\n" + "=" * 70); print("CROP DISEASE DETECTION - GPU TRAINING SYSTEM"); print("=" * 70)
        print("1. Batch process images"); print("2. Convert to TFRecord"); print("3. Train model"); print("4. Run inference"); print("0. Exit")
        choice = input("\nEnter choice: ").strip()
        
        if choice == '1':
            img_dir = input("Enter image dir: ").strip()
            if Path(img_dir).exists():
                processor = CropDiseaseDatasetProcessor(batch_size=64)
                ds = processor.create_dataset_from_directory(img_dir, shuffle=False)
                for b, _ in ds: pass # Dry run
                print("Processing complete.")
        elif choice == '2':
            img_dir = input("Enter image dir: ").strip()
            out_dir = input("Enter output dir: ").strip()
            if Path(img_dir).exists():
                processor = CropDiseaseDatasetProcessor(batch_size=64)
                processor.process_and_save_tfrecords(img_dir, out_dir)
        elif choice == '3':
            data_dir = input("Enter dataset dir: ").strip()
            if Path(data_dir).exists():
                train_ds, val_ds, n_classes, names = prepare_training_data(data_dir, "prepared_data")
                model = CropDiseaseModel(n_classes, model_type='mobilenetv3')
                model.build_model(); model.compile_model()
                model.train(train_ds, val_ds)
                model.convert_to_tflite('models/crop_disease.tflite')
        elif choice == '0': break

if __name__ == "__main__":
    try: main()
    except KeyboardInterrupt: print("\nExiting...")
