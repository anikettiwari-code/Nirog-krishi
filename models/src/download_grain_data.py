import kagglehub
import shutil
import os

# Define datasets for Grain Quality (Post-Harvest)
datasets = {
    "rice_varieties": "muratkokludataset/rice-image-dataset", # 5 Varieties: Arborio, Basmati, Ipsala, Jasmine, Karacadag
    "corn_seeds": "smaranjitghose/corn-seeds-classification"   # 4 Classes: Broken, Discolored, Pure, Silkcut
}

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DIR = os.path.join(BASE_DIR, "datasets", "grain_quality")

os.makedirs(RAW_DIR, exist_ok=True)

print(f"--- Downloading Grain Quality Datasets to {RAW_DIR} ---")

for name, slug in datasets.items():
    print(f"\n[DOWNLOADING] {name} ({slug})...")
    try:
        path = kagglehub.dataset_download(slug)
        print(f"[SUCCESS] Downloaded to cache: {path}")
        
        # Move/Copy logic
        # For Rice, the dataset usually has subfolders directly.
        # Check structure
        sub_items = os.listdir(path)
        print(f"contents: {sub_items}")

        for item in sub_items:
            s = os.path.join(path, item)
            d = os.path.join(RAW_DIR, f"{name}_{item}") # Prefix to avoid collisions
            
            # If it's a folder (Class), copy it
            if os.path.isdir(s):
                if os.path.exists(d):
                    print(f"  [SKIP] Folder {d} already exists.")
                else:
                    print(f"  [COPY] Copying {item} -> {d} ...")
                    shutil.copytree(s, d)
            # If it's a dataset inside a folder (common in Kaggle)
            elif item == "Rice_Image_Dataset": # Specific check for Rice dataset structure
                 inner_path = os.path.join(path, item)
                 for inner_item in os.listdir(inner_path):
                     s_inner = os.path.join(inner_path, inner_item)
                     d_inner = os.path.join(RAW_DIR, f"Rice_{inner_item}")
                     if os.path.isdir(s_inner):
                         if os.path.exists(d_inner):
                             print(f"  [SKIP] Folder {d_inner} already exists.")
                         else:
                             print(f"  [COPY] Copying {inner_item} -> {d_inner} ...")
                             shutil.copytree(s_inner, d_inner)

    except Exception as e:
        print(f"[ERROR] Failed to download {slug}: {e}")

print("\n[DONE] Grain datasets preparation complete.")
