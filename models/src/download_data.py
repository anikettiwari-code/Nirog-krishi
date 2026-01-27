import kagglehub
import shutil
import os
import pathlib

def download_and_setup_data():
    # 1. Define Datasets to Download
    datasets = {
        "plant_village": "abdallahalidev/plantvillage-dataset",
        "rice": "minhhuy2810/rice-diseases-image-dataset",
        "wheat": "oalisi/wheat-disease-data-set",
        "cgiar_wheat": "shadabhussain/cgiar-computer-vision-for-crop-disease", # CGIAR Real-world Wheat
        "plant_doc": "jarvis41/plantdoc-dataset" # Real-world Multi-crop
    }

    # 2. Define Target Root
    current_file = pathlib.Path(__file__)
    project_root = current_file.parent.parent # models/
    raw_dir = project_root / "datasets" / "raw"
    
    if not raw_dir.exists():
        os.makedirs(raw_dir, exist_ok=True)
        
    print(f"Target Directory: {raw_dir}")

    # 3. Download and Organize
    for name, slug in datasets.items():
        print(f"\n--- Processing {name} ({slug}) ---")
        try:
            cache_path = kagglehub.dataset_download(slug)
            print(f"Downloaded to cache: {cache_path}")
            
            # Walk through the cache and move class folders to raw_dir
            # This 'bifurcates' (organizes) the data by class
            for root, dirs, files in os.walk(cache_path):
                for dir_name in dirs:
                    source_folder = os.path.join(root, dir_name)
                    
                    # Construct a unique destination folder name to avoid conflicts
                    # e.g., "Rice_BrownSpot", "Potato_EarlyBlight"
                    # If the folder name is generic like "Healthy", prepend the crop name if possible
                    clean_name = dir_name.replace(" ", "_").replace("(", "").replace(")", "")
                    
                    # Logic to prefix generically named folders
                    if name == "rice" and "Rice" not in clean_name:
                         final_name = f"Rice_{clean_name}"
                    elif name == "wheat" and "Wheat" not in clean_name:
                         final_name = f"Wheat_{clean_name}"
                    elif name == "cgiar_wheat":
                         final_name = f"CGIAR_Wheat_{clean_name}"
                    elif name == "plant_doc":
                         final_name = f"PlantDoc_{clean_name}"
                    else:
                         final_name = clean_name
                         
                    dest_folder = raw_dir / final_name
                    
                    print(f"Moving {dir_name} -> {final_name}")
                    shutil.copytree(source_folder, dest_folder, dirs_exist_ok=True)
                    
        except Exception as e:
            print(f"Failed to download/process {name}: {e}")

    print("\n--- Download & Organization Complete ---")
    print("Folders in datasets/raw:")
    for item in raw_dir.iterdir():
        if item.is_dir():
            print(f" - {item.name}")

if __name__ == "__main__":
    download_and_setup_data()
