# 🚀 Deployment Guide: AI-Based Crop Recommendation System

This guide explains step-by-step how to deploy both the **FastAPI Backend** and **React + Vite Frontend** to free production cloud hosting platforms.

---

## 🛠️ Step 1: Push Project to GitHub

Make sure your latest code changes are pushed to GitHub:

```bash
git add .
git commit -m "Prepare project for production deployment"
git push origin main
```

---

## 🐍 Step 2: Deploy Backend (FastAPI) on Render

[Render](https://render.com) offers free hosting for Python web services.

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
2. Connect your GitHub repository (`AI-Based Crop Recommendation System`).
3. Configure the web service settings:
   - **Name**: `crop-recommendation-api` (or any name you choose)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave blank (or `backend` if deploying only backend subfolder)
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `uvicorn backend.app:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free`
4. Click **Create Web Service**.
5. Once deployed, copy your API backend URL (e.g., `https://crop-recommendation-api.onrender.com`).

---

## ⚛️ Step 3: Deploy Frontend (React) on Vercel or Render

### Option A: Vercel (Recommended for React)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** -> **Project**.
2. Import your GitHub repository.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and set to `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables** and add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://crop-recommendation-api.onrender.com` *(Replace with your Render API URL from Step 2)*
5. Click **Deploy**.

---

### Option B: Render Static Site

1. On Render Dashboard, click **New +** -> **Static Site**.
2. Connect your GitHub repo.
3. Configure:
   - **Name**: `crop-recommendation-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `frontend/dist`
4. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://crop-recommendation-api.onrender.com`
5. Click **Create Static Site**.

---

## 🧪 Step 4: Verification

1. Open your deployed Frontend URL in the browser.
2. Test submitting soil nutrient values ($N, P, K$, Temperature, Humidity, pH, Rainfall).
3. Test the **Auto Detect Location** weather button to ensure Open-Meteo geocoding works live.
4. Confirm prediction cards display correctly.
