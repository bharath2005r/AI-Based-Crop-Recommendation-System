# 🌱 AI-Based Crop Recommendation System

[![Live Demo](https://img.shields.io/badge/Live--Demo-Vercel-brightgreen?style=for-the-badge&logo=vercel)](https://ai-based-crop-recommendation-system-eight.vercel.app/)
[![API Backend](https://img.shields.io/badge/API--Backend-Render-blue?style=for-the-badge&logo=render)](https://crop-recommendation-api-07sp.onrender.com)

> 🚀 **Live Application**: [https://ai-based-crop-recommendation-system-eight.vercel.app/](https://ai-based-crop-recommendation-system-eight.vercel.app/)  
> ⚡ **Live API Swagger Docs**: [https://crop-recommendation-api-07sp.onrender.com/docs](https://crop-recommendation-api-07sp.onrender.com/docs)

An intelligent machine learning web application that assists farmers and agricultural enthusiasts in selecting the most suitable crop to cultivate based on specific soil nutrients, environmental parameters, and real-time live weather conditions.

---

## 📌 Project Overview

Agriculture success heavily relies on choosing the right crop for specific soil and environmental conditions. The **AI-Based Crop Recommendation System** leverages Machine Learning algorithms trained on comprehensive agricultural data (NPK values, temperature, humidity, pH, and rainfall) to accurately predict optimal crops.

The system features:
- A modern, interactive **React + Vite** frontend UI.
- A robust **FastAPI** backend powering real-time predictions and live weather integration via OpenWeather API.
- End-to-end Machine Learning pipeline documented in Jupyter Notebooks.

---

## ✨ Features

- **🌾 AI-Powered Predictions**: Predicts optimal crops from soil nutrients ($N, P, K$), pH level, temperature, humidity, and rainfall.
- **🌤️ Auto Live Weather Fetching**: Automatically fetches real-time temperature and humidity using user geolocation or city name.
- **🎨 Dynamic & Responsive UI**: Built with modern CSS design, smooth animations, and clean interactive forms.
- **⚡ High-Performance REST API**: Fast and scalable endpoints using FastAPI & Pydantic validation.
- **📊 Comprehensive Data Science Pipeline**: Exploratory Data Analysis (EDA), model training, evaluation, and serialization using scikit-learn.

---

## 🛠️ Technologies Used

### **Frontend**
- **Framework**: React.js (Vite)
- **Styling**: Vanilla CSS (CSS3 custom variables, glassmorphism, responsive layout)
- **HTTP Client**: Axios

### **Backend**
- **Framework**: FastAPI (Python 3.12)
- **Server**: Uvicorn
- **Validation**: Pydantic
- **Weather API**: OpenWeatherMap API

### **Machine Learning & Data Science**
- **Language**: Python
- **Libraries**: `scikit-learn`, `pandas`, `numpy`, `xgboost`, `matplotlib`, `seaborn`
- **Model Storage**: `joblib` / `pickle`

---

## 🏗️ Project Architecture

```
Crop prediction/
├── backend/                  # FastAPI Application
│   ├── app.py                # Main FastAPI entry point & routes
│   ├── predict.py            # Model inference logic
│   ├── schemas.py            # Pydantic request/response schemas
│   ├── weather.py            # Live Weather API integration service
│   └── requirements.txt      # Python dependencies for backend
├── dataset/                  # Dataset directory
│   └── Crop_recommendation.csv
├── frontend/                 # React (Vite) Frontend Application
│   ├── src/
│   │   ├── assets/           # UI media & images
│   │   ├── components/       # Reusable React components (Form, Result, Navbar, Hero, etc.)
│   │   ├── services/         # API integration layer (Axios)
│   │   ├── App.jsx           # Root Component
│   │   └── index.css         # Styling & token definitions
│   ├── package.json          # Node dependencies & scripts
│   └── vite.config.js
├── model/                    # Trained Machine Learning Artifacts
│   ├── crop_model.pkl        # Trained Classifier Model
│   └── label_encoder.pkl     # Encoded target labels
├── notebooks/                # ML Pipeline Notebooks
│   ├── 01_Data_Analysis.ipynb
│   ├── 02_EDA.ipynb
│   ├── 03_Data_Preprocessing.ipynb
│   ├── 04_Model_Training.ipynb
│   ├── 05_Model_Evaluation.ipynb
│   └── 06_Save_Model.ipynb
├── .gitignore
├── requirements.txt
└── README.md
```

---

## 🚀 Installation Steps

### Prerequisites
- **Python 3.9+** installed
- **Node.js 18+** & **npm** installed
- **Git** installed

---

### 1. Clone the Repository
```bash
git clone https://github.com/bharath2005r/AI-Based-Crop-Recommendation-System.git
cd AI-Based-Crop-Recommendation-System
```

---

### 2. Backend Setup (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   - **Windows:**
     ```bash
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **macOS / Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn app:app --reload --port 8000
   ```
   *Backend will run at:* `http://localhost:8000`  
   *API Documentation (Swagger UI):* `http://localhost:8000/docs`

---

### 3. Frontend Setup (React + Vite)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Frontend will run at:* `http://localhost:5173`

---

## 🔌 API Endpoints

### 1. Health Check
- **Endpoint**: `GET /`
- **Description**: Returns API status message.
- **Response**:
  ```json
  {
    "message": "Crop Recommendation API with Auto Weather Integration"
  }
  ```

### 2. Crop Prediction
- **Endpoint**: `POST /predict`
- **Description**: Predicts the best crop to cultivate based on input features.
- **Request Body**:
  ```json
  {
    "N": 90.0,
    "P": 42.0,
    "K": 43.0,
    "temperature": 20.87,
    "humidity": 82.0,
    "ph": 6.5,
    "rainfall": 202.93
  }
  ```
- **Response**:
  ```json
  {
    "recommended_crop": "rice"
  }
  ```

### 3. Fetch Live Weather Data
- **Endpoint**: `GET /weather`
- **Description**: Fetches current weather details by city name OR latitude & longitude coordinates.
- **Query Parameters**:
  - `city` *(optional)*: Name of the city (e.g., `Hyderabad`)
  - `lat` *(optional)*: Latitude float
  - `lon` *(optional)*: Longitude float
- **Example**: `GET /weather?city=Hyderabad` or `GET /weather?lat=17.385&lon=78.486`

---

## 🔮 Future Enhancements

- 🧪 **Soil Health & Fertilizer Recommendation**: Suggest fertilizer types and quantities based on deficient NPK values.
- 📈 **Market Price & Yield Forecasting**: Integrate real-time crop market prices and yield potential indicators.
- 🌐 **Multi-Language Support**: Provide regional language translation for farmers across different geographical regions.
- 📱 **Mobile Application**: Develop a native mobile application using React Native or Flutter.
- 🦟 **Pest & Disease Detection**: Implement computer vision models for early plant disease diagnosis via leaf images.

---

## 👨‍💻 Author
**Bharath R**  
---


