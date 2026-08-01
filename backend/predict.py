import joblib
import numpy as np

model = joblib.load("../model/crop_model.pkl")
encoder = joblib.load("../model/label_encoder.pkl")


def predict_crop(data):
    features = np.array([[
        data.N,
        data.P,
        data.K,
        data.temperature,
        data.humidity,
        data.ph,
        data.rainfall
    ]])

    prediction = model.predict(features)

    crop = encoder.inverse_transform(prediction)

    return crop[0]