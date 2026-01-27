# 🪟 Windows Quick Start Guide
## Crop Disease Detection - GPU Training

### ⚡ Super Quick Setup (3 clicks!)

1. **Double-click:** `SETUP_WINDOWS.bat`
   - Installs everything automatically
   - Tests your GPU
   - Takes 5-10 minutes

2. **Double-click:** `TEST_GPU.bat`
   - Verifies GPU is working
   - Shows expected speed

3. **Double-click:** `RUN_TRAINING.bat`
   - Opens interactive menu
   - Process/train your 400k images

That's it! 🎉

---

## 📝 Manual Setup (if batch files don't work)

### Step 1: Open Command Prompt

Press `Win + R`, type `cmd`, press Enter

### Step 2: Navigate to this folder

```cmd
cd C:\path\to\crop-disease-detection
```

### Step 3: Create virtual environment

```cmd
python -m venv tf_gpu_env
tf_gpu_env\Scripts\activate
```

### Step 4: Install packages

```cmd
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### Step 5: Test GPU

```cmd
python quick_start.py
```

### Step 6: Start training

```cmd
python main.py
```
