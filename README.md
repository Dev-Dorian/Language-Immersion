Markdown# 🌍 Language Immersion AI App

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.74+-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-51.0+-000000?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/Ollama-Local_LLM-000000?style=for-the-badge&logo=ollama&logoColor=white" alt="Ollama" />
</p>

An intelligent, real-world language learning mobile application powered by computer vision and local edge AI. Point your camera at any everyday object, capture an image, and instantly receive target vocabulary, phonetic guidance, and **10 contextual practice sentences** tailored to your chosen language.

---

## 📸 Application Preview

<p align="center">
  <!-- Replace these image URLs with your actual screenshots/GIFs once hosted -->
  <img src="https://raw.githubusercontent.com/placeholder/repo/main/docs/assets/camera-view.png" alt="Camera Scanner" width="280"/>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/placeholder/repo/main/docs/assets/loading-state.png" alt="Ollama Processing" width="280"/>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/placeholder/repo/main/docs/assets/results-view.png" alt="Vocabulary & Sentences List" width="280"/>
</p>

---

## ✨ Key Features

- 👁️ **Visual Object Recognition**: Instant computer vision processing powered by local multimodal LLMs.
- 🗣️ **Contextual Sentence Generation**: Generates 10 natural, varied practice sentences per captured object.
- 🔤 **Phonetic Pronunciation Guide**: Includes international phonetic guides to master accents quickly.
- 🌐 **Multi-Language Target Switching**: Dynamically switch target languages (French, German, Spanish, Italian, Japanese, etc.) on the fly.
- 🔒 **100% Private & Local AI Processing**: Powered by Ollama on your local network — zero image data is sent to external cloud vendors.
- 🧪 **Offline UI Development Mode**: Built-in mock data toggles for rapid UI styling and CSS/StyleSheet testing without model execution delays.

---

## 🏗️ Architecture & Stack
```text
  📱 Mobile Client (React Native + Expo)
         │
         │  HTTP POST (Base64 Image + Target Language)
         ▼
  ⚡ Backend API (FastAPI + Uvicorn)
         │
         │  Local Inference Stream
         ▼
  🦙 Vision Engine (Ollama Local LLM)
```

Domain Technology Description Frontend React Native / ExpoCross-platform mobile UI (CameraView, StyleSheet) Backend Python 3.10+ / FastAPI High-performance asynchronous API & schema validation AI Inference Ollama Engine Local execution of multimodal vision models (llama3.2-vision)Data Protocol REST / JSON Structured JSON payload parsing via Pydantic schemas

## 📋 System Requirements 
PrerequisitesNode.js: v18.x or later 
npm or yarnPython: v3.10 or later
Ollama: Installed and running locally
Hardware: Dedicated GPU recommended for fast local vision inference (Apple Silicon M-series, NVIDIA RTX series, etc.)

## 🚀 Installation & Setup

1. Repository Setup Bash
``` text
   # Clone the repository
   git clone [https://github.com/your-username/language-immersion-app.git](https://github.com/your-username/language-immersion-app.git)
  
   # Navigate into the project root
   cd language-immersion-app 
```

2. Backend Setup (FastAPI + Ollama)

1. Pull and start your vision model in Ollama:
``` text
   Bash
   ollama run llama3.2-vision
```
2. Configure the Python Environment:

``` text
   Bash
  
   cd backend
  
   # Create a virtual environment
   python -m venv venv
  
   # Activate virtual environment
   # On macOS/Linux:
   source venv/bin/activate
   # On Windows:
   venv\Scripts\activate
```

3. Install Dependencies:
``` text
   Bash

   pip install -r requirements.txt
```

4. Run the FastAPI Server:
``` text
Bash

   uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 💡 The backend API docs will be live at http://localhost:8000/docs3. 

3. Frontend Setup (React Native + Expo)

1. Install Node Dependencies:
```
   Bashcd ../frontend
   npm install
```
2. Configure Local Environment:
   Ensure your mobile device or emulator can communicate with your computer's local IP address (e.g., http://192.168.x.x:8000).

3. Launch the Expo Server:
```
   Bash

   npx expo start
```
4. Run the App:

   - Physical Device: Scan the generated QR code using the Expo Go app (iOS/Android).

   - Emulator: Press a for Android Emulator or i for iOS Simulator in the Expo CLI terminal.

🔌 API Endpoint Documentation

POST /analyze-image
Processes a base64-encoded image and generates targeted vocabulary metrics.

Request Body
```
JSON{
  "image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "target_language": "french"
}
```
Response Body (200 OK)

JSON{
  "object_detected": "Sunglasses",
  "target_language": "french",
  "vocabulary": "les lunettes de soleil",
  "phonetic": "lay loo-net duh soh-lay",
  "examples": [
    "1. J'ai besoin de mes lunettes pour lire ce livre.",
    "2. Où ai-je mis mes lunettes de soleil ?",
    "3. Les lunettes sont sur la table du salon.",
    "4. Il porte des lunettes depuis l'âge de dix ans.",
    "5. Mes lunettes sont très propres aujourd'hui.",
    "6. As-tu vu mes nouvelles lunettes ?",
    "7. Elle a acheté des lunettes très élégantes.",
    "8. N'oublie pas tes lunettes avant de sortir.",
    "9. Ces lunettes me protègent bien de la lumière.",
    "10. Je dois changer les verres de mes lunettes."
  ]
}


## 📂 Repository Structure
```
Plaintextlanguage-immersion-app/
├── backend/
│   ├── main.py              # FastAPI server entry point & routing
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── index.tsx               # Main React Native application layout
│   ├── styles.tsx        # Modularized UI styles (StyleSheet)
│   └── package.json         # React Native dependencies & scripts
├── .gitignore               # Ignored build outputs and environments
└── README.md                # Project documentation
```

## 🛠️ Development & UI Styling Mode

To speed up styling iterations on the results card without sending requests to the LLM backend every time, use the built-in Mock Data Mode:
```
JavaScript

// App.js (Temporary UI Dev Override)
const [result, setResult] = useState(MOCK_RESULT);
```

Or tap the 🧪 Test UI button directly inside the app controls overlay.

## 📄 License 
Distributed under the MIT License. See LICENSE for more information.
