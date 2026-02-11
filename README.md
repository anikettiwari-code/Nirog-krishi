# 🌱 Nirog Krishi - AI-Powered Crop Disease Detection

<div align="center">

![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?logo=react)
![Expo](https://img.shields.io/badge/Expo-54.0.0-000020?logo=expo)
![TensorFlow Lite](https://img.shields.io/badge/TensorFlow_Lite-2.10-FF6F00?logo=tensorflow)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)
![Gemini AI](https://img.shields.io/badge/Gemini_2.5-AI-4285F4?logo=google)

**An intelligent mobile application for real-time crop disease detection with AI-powered diagnosis, treatment recommendations, and community outbreak alerts.**

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [AI Model](#-ai-model)
- [Backend API](#-backend-api)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)

---

## ✨ Features

### 🔬 AI Disease Detection
- **Real-time leaf analysis** using Gemini 2.5 Flash AI + on-device TensorFlow Lite
- **45+ disease classes** covering major crops (Tomato, Potato, Apple, Rice, Corn, Grape, etc.)
- **Plant type identification** automatically detected from leaf image
- **Severity assessment** (Mild/Moderate/Severe)
- **Confidence scores** for prediction reliability

### 💊 Treatment Recommendations
- **Organic remedies** - Natural, eco-friendly treatment options
- **Chemical remedies** - Professional-grade fungicides and pesticides
- **Symptom descriptions** for disease verification
- **Prevention tips** to avoid future infections

### �️ Outbreak Detection & Alerts
- **Automatic cluster detection** - Identifies disease outbreaks when 7+ cases reported in 5km radius
- **Red Zone mapping** - Visual outbreak zones on map
- **Push notifications** - Alerts users within 10km of outbreak
- **GeoJSON API** - Real-time outbreak data for mapping

### 💬 AI Chatbot
- **CropGuard AI Assistant** - Powered by Gemini 2.5
- **Agricultural expertise** - Answers about diseases, pests, fertilizers, irrigation
- **Conversation history** - Maintains context across sessions

### �📱 Mobile App Features
- **Camera integration** - Capture leaf images directly
- **Gallery upload** - Analyze existing photos
- **Scan history** - Track past diagnoses with images
- **Location-based features** - Nearby outbreaks, community stats
- **Notifications** - Real-time alerts for nearby disease outbreaks

---

## 🛠 Tech Stack

### Frontend (Mobile App)
| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | 0.81.5 | Cross-platform mobile framework |
| Expo | 54.0.0 | Development platform |
| TypeScript | 5.8.3 | Type-safe JavaScript |
| React Navigation | 7.x | App navigation |
| react-native-fast-tflite | 2.0.0 | On-device ML inference |
| Firebase | 12.8.0 | Authentication |
| Redux Toolkit | 2.8.2 | State management |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Server runtime |
| Express.js | REST API framework |
| MongoDB/Mongoose | Database |

### AI/ML
| Component | Details |
|-----------|---------|
| Model Architecture | MobileNetV3Large |
| Framework | TensorFlow 2.10 |
| Inference | TensorFlow Lite |
| Training Hardware | NVIDIA RTX 4050 GPU |
| Dataset | PlantVillage + CGIAR Wheat + Rice Disease |

---

## 📁 Project Structure

```
Nirog-Krishi/
├── frontend/                    # React Native Expo App
│   ├── app/                     # App screens (Expo Router)
│   ├── components/              # Reusable UI components
│   ├── services/                # API services
│   ├── models/                  # TFLite model assets
│   ├── lib/                     # Utilities
│   └── constants/               # App constants
│
├── backend/                     # Node.js Backend
│   ├── server.js                # Main server file
│   ├── functions/               # Cloud functions
│   ├── models/                  # Database models
│   └── config/                  # Configuration
│
├── models/                      # AI Model Training
│   ├── final_model/             # Production model files
│   │   ├── disease_model.tflite # TFLite model (3.93 MB)
│   │   ├── labels.txt           # 45 disease classes
│   │   └── disease_remedies.json# Treatment database
│   ├── gpu_pipeline/            # Training scripts
│   ├── datasets/                # Training data
│   └── assets/                  # Model assets
│
└── docs/                        # Documentation
```

---

## 🤖 AI Model

### Model Specifications

| Specification | Value |
|---------------|-------|
| Architecture | MobileNetV3Large + Custom Head |
| Input Size | 224 × 224 × 3 |
| Output Classes | 45 |
| Model Size | 3.93 MB (TFLite) |
| Parameters | 3.6M |

### Supported Crops & Diseases

| Crop | Diseases Detected |
|------|-------------------|
| 🍅 Tomato | Bacterial Spot, Early Blight, Late Blight, Leaf Mold, Septoria, Spider Mites, Target Spot, Yellow Leaf Curl Virus, Mosaic Virus, Healthy |
| 🥔 Potato | Early Blight, Late Blight, Healthy |
| 🍎 Apple | Apple Scab, Black Rot, Cedar Apple Rust, Healthy |
| 🌽 Corn | Gray Leaf Spot, Common Rust, Northern Leaf Blight, Healthy |
| 🍇 Grape | Black Rot, Esca, Isariopsis Leaf Spot, Healthy |
| 🌾 Rice | Brown Spot, Hispa, Leaf Blast, Healthy |
| 🌾 Wheat | Leaf Rust, Stem Rust, Healthy |
| 🫑 Pepper | Bacterial Spot, Healthy |
| 🍑 Peach | Bacterial Spot, Healthy |
| 🍓 Strawberry | Leaf Scorch, Healthy |
| + More... | Cherry, Blueberry, Raspberry, Squash, Soybean, Orange |

### Model Files for Integration

```
models/final_model/
├── disease_model.tflite      # Main model file (copy to app assets)
├── labels.txt                # Class labels in order
└── disease_remedies.json     # Remedies database (plant, symptoms, treatments)
```

---

## 🚀 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- Android Studio / Xcode (for native builds)

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/anikettiwari-code/Nirog-krishi.git
cd Nirog-krishi/frontend

# Install dependencies
npm install

# Start Expo development server
npm run dev
```

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Start server
node server.js
```

### AI Model Integration

1. Copy model files to frontend:
```bash
cp models/final_model/disease_model.tflite frontend/models/
cp models/final_model/labels.txt frontend/models/
cp models/final_model/disease_remedies.json frontend/models/
```

2. Use `react-native-fast-tflite` for inference (already configured)

---

## 📱 Usage

### Disease Detection Flow

1. **Capture/Upload Image** - Take photo of diseased leaf or select from gallery
2. **AI Analysis** - Model processes image on-device
3. **View Results** - See detected disease, confidence, and plant type
4. **Get Remedies** - Access organic and chemical treatment options

### Sample API Response

```json
{
  "plant_type": "Potato",
  "disease_name": "Early Blight",
  "confidence": 60.2,
  "symptoms": [
    "Dark brown spots with concentric rings",
    "Target-like pattern",
    "Lower leaf yellowing"
  ],
  "organic_remedies": [
    "Apply copper or neem oil spray",
    "Remove infected foliage",
    "Hill soil around plants",
    "Rotate crops for 3+ years"
  ],
  "chemical_remedies": [
    "Chlorothalonil fungicide",
    "Mancozeb spray",
    "Azoxystrobin treatment"
  ]
}
```

---

## 📚 API Reference

### Disease Detection Endpoint

```
POST /api/detect
Content-Type: multipart/form-data

Body: image (file)

Response: Disease diagnosis with remedies
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Team

**Nirog Krishi Development Team**

---

<div align="center">

**Made with ❤️ for Indian Farmers**

🌾 *Empowering Agriculture with AI* 🌾

</div>
