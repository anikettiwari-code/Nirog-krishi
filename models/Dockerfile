# Use official TensorFlow GPU image (if available on host) or CPU
# using CPU-only for broader compatibility in this example, change to tensorflow/tensorflow:latest-gpu for GPU
FROM tensorflow/tensorflow:latest

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3-pip \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY src/ ./src/
COPY assets/ ./assets/
# Note: We do NOT copy datasets/ by default to keep image small. 
# Data should be mounted as a volume.

# Default command: Run the disease training script
CMD ["python", "src/train_disease.py"]
