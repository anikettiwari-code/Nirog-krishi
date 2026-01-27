import kagglehub
import shutil
import os
import pathlib
import random

def setup_leaf_check_data():
    current_file = pathlib.Path(__file__)
    project_root = current_file.parent.parent # models/
    
    # Target Directories
    base_dir = project_root / "datasets" / "leaf_check"
    leaf_dir = base_dir / "leaf"
    random_dir = base_dir / "random"
    
    if not base_dir.exists():
        os.makedirs(leaf_dir, exist_ok=True)
        os.makedirs(random_dir, exist_ok=True)
    
    print(f"Setting up Leaf Check dataset in: {base_dir}")

    # 1. Download Random Images (Negative Class)
    print("\n--- Downloading Random Images (Negative Class) ---")
    try:
        # Use a more reliable dataset slug
        cache_path = kagglehub.dataset_download("pankajkumar2002/random-image-sample-dataset") 
        print(f"Downloaded random images to: {cache_path}")
        
        # Copy a subset to 'random' folder
        count = 0
        limit = 1000 
        for root, dirs, files in os.walk(cache_path):
            for file in files:
                if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                    src = os.path.join(root, file)
                    dst = random_dir / f"random_{count}.jpg"
                    shutil.copy2(src, dst)
                    count += 1
                    if count >= limit:
                        break
            if count >= limit:
                break
        print(f"Copied {count} random images to {random_dir}")
        
    except Exception as e:
        print(f"Error downloading random images: {e}")

    # 1.5 Retry PlantDoc (If missing)
    print("\n--- Processing PlantDoc (Retry) ---")
    try:
        raw_dir = project_root / "datasets" / "raw"
        cache_path = kagglehub.dataset_download("jarvis41/plantdoc-dataset")
        print(f"Downloaded PlantDoc to: {cache_path}")
        
        for root, dirs, files in os.walk(cache_path):
            for dir_name in dirs:
                # PlantDoc folders often look like "Apple leaf", "Bell_pepper leaf"
                clean_name = dir_name.replace(" ", "_").replace("(", "").replace(")", "")
                final_name = f"PlantDoc_{clean_name}"
                
                source_folder = os.path.join(root, dir_name)
                dest_folder = raw_dir / final_name
                
                # Only move if it looks like a class folder (has images)
                # Simple heuristic: ignore 'train', 'test' top level if they are empty of images
                # But typically os.walk hits bottom.
                print(f"Moving {dir_name} -> {final_name}")
                shutil.copytree(source_folder, dest_folder, dirs_exist_ok=True)
                
    except Exception as e:
         print(f"Error downloading PlantDoc: {e}")

    # 2. Sample Leaf Images (Positive Class)
    # We take images from our existing 'datasets/raw' folder (PlantVillage etc)
    print("\n--- Sampling Leaf Images (Positive Class) ---")
    raw_dir = project_root / "datasets" / "raw"
    
    if not raw_dir.exists():
        print(f"Warning: {raw_dir} does not exist yet. Run download_data.py first!")
        return

    count = 0
    limit = 1000
    
    # Gather all potential leaf images
    all_leaf_images = []
    for root, dirs, files in os.walk(raw_dir):
        for file in files:
             if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                 all_leaf_images.append(os.path.join(root, file))
    
    # Shuffle and pick
    if all_leaf_images:
        selected_images = random.sample(all_leaf_images, min(len(all_leaf_images), limit))
        
        for src in selected_images:
            dst = leaf_dir / f"leaf_{count}.jpg"
            shutil.copy2(src, dst)
            count += 1
            
        print(f"Copied {count} leaf images to {leaf_dir}")
    else:
        print("No leaf images found in datasets/raw. Wait for main download to finish.")

if __name__ == "__main__":
    setup_leaf_check_data()
