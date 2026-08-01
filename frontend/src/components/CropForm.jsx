import { useState } from "react";
import { 
  FaLeaf, 
  FaFlask, 
  FaTint, 
  FaThermometerHalf, 
  FaCloudRain, 
  FaSyncAlt, 
  FaVial,
  FaCheckCircle,
  FaSpinner,
  FaMapMarkerAlt,
  FaSearchLocation,
  FaCloudSun
} from "react-icons/fa";
import API from "../services/api";

function CropForm() {
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });

  const [cityInput, setCityInput] = useState("");
  const [fetchingWeather, setFetchingWeather] = useState(false);
  const [weatherSuccessMsg, setWeatherSuccessMsg] = useState("");
  const [autoFilledFields, setAutoFilledFields] = useState(false);

  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errorMsg) setErrorMsg("");
  };

  // Helper to update weather metrics into form state
  const applyWeatherData = (data) => {
    setFormData((prev) => ({
      ...prev,
      temperature: data.temperature !== undefined ? data.temperature : prev.temperature,
      humidity: data.humidity !== undefined ? data.humidity : prev.humidity,
      rainfall: data.rainfall !== undefined ? data.rainfall : prev.rainfall,
    }));
    setAutoFilledFields(true);
    setWeatherSuccessMsg(
      `Auto-filled weather for ${data.city || "Location"}: Temp ${data.temperature}°C | Humidity ${data.humidity}% | Rain ${data.rainfall}mm`
    );
  };

  // Fetch Weather by City Name (calls Backend API or direct fallback)
  const handleFetchWeatherByCity = async (e) => {
    if (e) e.preventDefault();
    if (!cityInput.trim()) return;

    setFetchingWeather(true);
    setWeatherSuccessMsg("");
    setErrorMsg("");

    try {
      // 1. Try Backend API first
      const res = await API.get(`/weather?city=${encodeURIComponent(cityInput.trim())}`);
      if (res.data && !res.data.error) {
        applyWeatherData(res.data);
      } else if (res.data && res.data.error) {
        setErrorMsg(res.data.error);
      } else {
        throw new Error("Backend weather response invalid");
      }
    } catch (backendErr) {
      console.warn("Backend weather endpoint failed, trying direct Open-Meteo API fallback...", backendErr);
      // 2. Direct Open-Meteo fallback
      try {
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityInput.trim())}&count=1&language=en&format=json`
        );
        const geoData = await geoRes.json();
        if (!geoData.results || geoData.results.length === 0) {
          setErrorMsg(`City "${cityInput}" not found. Please try another city.`);
          return;
        }

        const { latitude, longitude, name, country } = geoData.results[0];
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation&daily=precipitation_sum&timezone=auto`
        );
        const weatherData = await weatherRes.json();
        const current = weatherData.current || {};
        const daily = weatherData.daily || {};
        const rawRain = (daily.precipitation_sum && daily.precipitation_sum[0]) || 0;

        applyWeatherData({
          city: `${name}, ${country || ''}`.strip ? `${name}, ${country}` : name,
          temperature: Math.round(current.temperature_2m * 10) / 10,
          humidity: Math.round(current.relative_humidity_2m * 10) / 10,
          rainfall: rawRain > 0 ? Math.round(rawRain * 10) / 10 : 100,
        });
      } catch (err) {
        setErrorMsg("Unable to fetch weather. Please check your internet connection.");
      }
    } finally {
      setFetchingWeather(false);
    }
  };

  // Fetch Weather by GPS Location
  const handleFetchWeatherByLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      return;
    }

    setFetchingWeather(true);
    setWeatherSuccessMsg("");
    setErrorMsg("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // 1. Try Backend API
          const res = await API.get(`/weather?lat=${latitude}&lon=${longitude}`);
          if (res.data && !res.data.error) {
            applyWeatherData(res.data);
          } else {
            throw new Error("Backend response error");
          }
        } catch (backendErr) {
          // 2. Direct Open-Meteo fallback
          try {
            const weatherRes = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation&daily=precipitation_sum&timezone=auto`
            );
            const weatherData = await weatherRes.json();
            const current = weatherData.current || {};
            const daily = weatherData.daily || {};
            const rawRain = (daily.precipitation_sum && daily.precipitation_sum[0]) || 0;

            applyWeatherData({
              city: "Your Current Location",
              temperature: Math.round(current.temperature_2m * 10) / 10,
              humidity: Math.round(current.relative_humidity_2m * 10) / 10,
              rainfall: rawRain > 0 ? Math.round(rawRain * 10) / 10 : 105,
            });
          } catch (err) {
            setErrorMsg("Unable to fetch weather for your location.");
          }
        } finally {
          setFetchingWeather(false);
        }
      },
      (error) => {
        setFetchingWeather(false);
        setErrorMsg("Location access denied or unavailable. You can enter your city manually above.");
      }
    );
  };

  // Handle Prediction Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setPrediction("");

    try {
      const payload = {
        N: parseFloat(formData.N) || 0,
        P: parseFloat(formData.P) || 0,
        K: parseFloat(formData.K) || 0,
        temperature: parseFloat(formData.temperature) || 0,
        humidity: parseFloat(formData.humidity) || 0,
        ph: parseFloat(formData.ph) || 0,
        rainfall: parseFloat(formData.rainfall) || 0,
      };

      const response = await API.post("/predict", payload);
      if (response.data && response.data.recommended_crop) {
        setPrediction(response.data.recommended_crop);
      } else {
        setErrorMsg("Unexpected response format from server.");
      }
    } catch (error) {
      console.error("Prediction API Error:", error);
      setErrorMsg("Unable to connect to backend server. Make sure FastAPI server is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Reset
  const handleReset = () => {
    setFormData({
      N: "",
      P: "",
      K: "",
      temperature: "",
      humidity: "",
      ph: "",
      rainfall: "",
    });
    setCityInput("");
    setPrediction("");
    setErrorMsg("");
    setWeatherSuccessMsg("");
    setAutoFilledFields(false);
  };

  return (
    <div className="crop-card-container">
      <div className="crop-card">

        {/* Card Header */}
        <div className="card-header-section">
          <div className="header-icon-badge">
            <svg className="badge-sprout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 20h10" />
              <path d="M10 20c0-4.4 3.6-8 8-8v-1c-4.4 0-8 3.6-8 8" />
              <path d="M14 20c0-7.7-6.3-14-14-14v1c7.7 0 14 6.3 14 14" />
            </svg>
          </div>
          
          <h2 className="card-title">Enter Soil & Weather Details</h2>
          <p className="card-subtitle">Fill in the details below or auto-fetch weather metrics to get crop recommendations</p>
          <div className="header-accent-line"></div>
        </div>

        {/* Weather Auto-Fetch Integration Section */}
        <div className="weather-autofetch-box">
          <div className="weather-box-title">
            <FaCloudSun className="weather-icon-head" />
            <span>Auto-Fetch Weather Metrics (Temp, Humidity, Rainfall)</span>
          </div>

          <div className="weather-controls">
            {/* GPS Location Button */}
            <button
              type="button"
              className="btn-location-fetch"
              onClick={handleFetchWeatherByLocation}
              disabled={fetchingWeather}
            >
              <FaMapMarkerAlt />
              <span>Use My Location</span>
            </button>

            <span className="weather-divider-or">OR</span>

            {/* City Search Form */}
            <form onSubmit={handleFetchWeatherByCity} className="city-search-form">
              <div className="city-input-wrapper">
                <FaSearchLocation className="city-search-icon" />
                <input
                  type="text"
                  placeholder="Enter City Name (e.g. Mumbai, London)..."
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  className="city-input"
                />
              </div>
              <button
                type="submit"
                className="btn-city-fetch"
                disabled={fetchingWeather || !cityInput.trim()}
              >
                {fetchingWeather ? <FaSpinner className="spin" /> : "Fetch Weather"}
              </button>
            </form>
          </div>

          {/* Success Banner when weather is fetched */}
          {weatherSuccessMsg && (
            <div className="weather-success-banner">
              <FaCheckCircle className="banner-icon" />
              <span>{weatherSuccessMsg}</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="crop-form">
          <div className="form-grid">

            {/* Nitrogen (N) */}
            <div className="form-group">
              <label className="input-label">Nitrogen (N)</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <FaLeaf />
                </span>
                <input
                  type="number"
                  step="any"
                  className="custom-input"
                  placeholder="Enter Nitrogen value"
                  name="N"
                  value={formData.N}
                  onChange={handleChange}
                  required
                />
                <span className="input-unit">kg/ha</span>
              </div>
            </div>

            {/* Humidity (%) - Auto-Fetch Enabled */}
            <div className="form-group">
              <label className="input-label">
                Humidity (%)
                {autoFilledFields && <span className="autofill-badge">Auto-filled</span>}
              </label>
              <div className={`input-wrapper ${autoFilledFields ? "autofilled-highlight" : ""}`}>
                <span className="input-icon">
                  <FaTint />
                </span>
                <input
                  type="number"
                  step="any"
                  className="custom-input"
                  placeholder="Enter Humidity"
                  name="humidity"
                  value={formData.humidity}
                  onChange={handleChange}
                  required
                />
                <span className="input-unit">%</span>
              </div>
            </div>

            {/* Phosphorus (P) */}
            <div className="form-group">
              <label className="input-label">Phosphorus (P)</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <FaFlask />
                </span>
                <input
                  type="number"
                  step="any"
                  className="custom-input"
                  placeholder="Enter Phosphorus value"
                  name="P"
                  value={formData.P}
                  onChange={handleChange}
                  required
                />
                <span className="input-unit">kg/ha</span>
              </div>
            </div>

            {/* pH Value */}
            <div className="form-group">
              <label className="input-label">pH Value</label>
              <div className="input-wrapper">
                <span className="input-icon ph-icon-text">
                  <FaVial />
                </span>
                <input
                  type="number"
                  step="0.01"
                  className="custom-input"
                  placeholder="Enter pH value"
                  name="ph"
                  value={formData.ph}
                  onChange={handleChange}
                  required
                />
                <span className="input-unit">pH</span>
              </div>
            </div>

            {/* Potassium (K) */}
            <div className="form-group">
              <label className="input-label">Potassium (K)</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <FaFlask />
                </span>
                <input
                  type="number"
                  step="any"
                  className="custom-input"
                  placeholder="Enter Potassium value"
                  name="K"
                  value={formData.K}
                  onChange={handleChange}
                  required
                />
                <span className="input-unit">kg/ha</span>
              </div>
            </div>

            {/* Temperature (°C) - Auto-Fetch Enabled */}
            <div className="form-group">
              <label className="input-label">
                Temperature (°C)
                {autoFilledFields && <span className="autofill-badge">Auto-filled</span>}
              </label>
              <div className={`input-wrapper ${autoFilledFields ? "autofilled-highlight" : ""}`}>
                <span className="input-icon">
                  <FaThermometerHalf />
                </span>
                <input
                  type="number"
                  step="any"
                  className="custom-input"
                  placeholder="Enter Temperature"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  required
                />
                <span className="input-unit">°C</span>
              </div>
            </div>

            {/* Rainfall (mm) - Auto-Fetch Enabled */}
            <div className="form-group full-width-sm">
              <label className="input-label">
                Rainfall (mm)
                {autoFilledFields && <span className="autofill-badge">Auto-filled</span>}
              </label>
              <div className={`input-wrapper ${autoFilledFields ? "autofilled-highlight" : ""}`}>
                <span className="input-icon">
                  <FaCloudRain />
                </span>
                <input
                  type="number"
                  step="any"
                  className="custom-input"
                  placeholder="Enter Rainfall"
                  name="rainfall"
                  value={formData.rainfall}
                  onChange={handleChange}
                  required
                />
                <span className="input-unit">mm</span>
              </div>
            </div>

          </div>

          {/* Form Action Buttons */}
          <div className="button-group">
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="btn-icon spin" />
                  <span>Predicting...</span>
                </>
              ) : (
                <>
                  <FaLeaf className="btn-icon" />
                  <span>Predict Crop</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="btn-reset"
              onClick={handleReset}
            >
              <FaSyncAlt className="btn-icon" />
              <span>Reset</span>
            </button>
          </div>
        </form>

        {/* Error Notification */}
        {errorMsg && (
          <div className="error-alert">
            <p>{errorMsg}</p>
          </div>
        )}

        {/* Prediction Result Display */}
        {prediction && (
          <div className="result-card-container">
            <div className="result-header">
              <FaCheckCircle className="result-icon" />
              <h3>Optimal Crop Recommendation</h3>
            </div>
            <div className="result-body">
              <div className="crop-badge-wrapper">
                <span className="crop-emoji">🌾</span>
                <h1 className="crop-name">{prediction}</h1>
              </div>
              <p className="result-desc">
                Based on your soil parameters (N: <strong>{formData.N}</strong>, P: <strong>{formData.P}</strong>, K: <strong>{formData.K}</strong>, pH: <strong>{formData.ph}</strong>) 
                and weather metrics (Temp: <strong>{formData.temperature}°C</strong>, Humidity: <strong>{formData.humidity}%</strong>, Rain: <strong>{formData.rainfall}mm</strong>), 
                cultivating <strong className="highlight-crop">{prediction}</strong> will deliver optimal yield.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default CropForm;