from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from schemas import CropInput
from predict import predict_crop
from weather import get_weather_by_city, get_weather_by_coords

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Crop Recommendation API with Auto Weather Integration"
    }


@app.post("/predict")
def predict(data: CropInput):
    crop = predict_crop(data)
    return {
        "recommended_crop": crop
    }


@app.get("/weather")
def weather(city: Optional[str] = Query(None), lat: Optional[float] = Query(None), lon: Optional[float] = Query(None)):
    """
    Fetch weather by city name OR latitude/longitude coordinates.
    """
    if city:
        return get_weather_by_city(city)
    elif lat is not None and lon is not None:
        return get_weather_by_coords(lat, lon)
    else:
        return {"error": "Please provide either a city name or latitude and longitude coordinates."}