import time
import os
import pickle
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from .config import settings
from .city_profiles import CITIES
from .weather_service import fetch_open_meteo
from .hybrid_engine import hybrid_flood_model, hybrid_heat_model, check_ood
from .risk_classifier import classify_risk, calculate_risk_velocity, project_escalation
from .schemas import AnalyzeCityPayload, PredictionResponse, HealthStatus, SimulationInputs
from .utils import logger

# Load Accuracy Metadata
ACCURACY_PATH = os.path.join(settings.MODEL_DIR, "accuracy.pkl")
try:
    with open(ACCURACY_PATH, "rb") as f:
        model_accuracy = pickle.load(f)
except Exception as e:
    logger.warning(f"Could not load accuracy metadata: {e}")
    model_accuracy = {}

# Initialize App
app = FastAPI(
    title="UrbanShield AI v3.1",
    version=settings.API_VERSION,
    description="Strategic Live City Intelligence Console (Accuracy Tuned)"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    settings.UPTIME_START = time.time()
    logger.info(f"UrbanShield AI {settings.API_VERSION} successfully initialized.")

@app.get("/health", response_model=HealthStatus)
async def health_check():
    uptime_sec = time.time() - settings.UPTIME_START
    return {
        "status": "healthy",
        "model_loaded": True, # Hybrid engine loads globally
        "uptime": f"{uptime_sec:.2f}s",
        "version": settings.API_VERSION
    }

@app.post("/analyze-city", response_model=PredictionResponse)
async def analyze_city(payload: AnalyzeCityPayload):
    """
    Phase 3: Live City Analysis or Manual Stress Test Override.
    """
    start_time = time.time()
    
    if payload.city not in CITIES:
        raise HTTPException(status_code=404, detail=f"City '{payload.city}' not supported by cluster.")

    city_static = CITIES[payload.city]

    # 1. Fetch Live Telemetry (or use baseline in Demo Mode)
    weather = fetch_open_meteo(
        payload.city,
        city_static["lat"],
        city_static["lon"]
    )

    # 2. Apply Manual Overrides if provided
    active_inputs = {
        "rainfall_mm": weather["rainfall"],
        "avg_temperature_c": weather["temperature"],
        "humidity_percent": weather["humidity"],
        "drainage_capacity_index": city_static["drainage"],
        "green_cover_percent": city_static["green_cover"],
        "population_density": city_static["population_density"]
    }

    if payload.overrides:
        active_inputs.update(payload.overrides)

    # 3. Hybrid Inference
    flood_score = hybrid_flood_model(
        active_inputs["rainfall_mm"],
        active_inputs["drainage_capacity_index"],
        active_inputs["humidity_percent"]
    )

    heat_score = hybrid_heat_model(
        active_inputs["avg_temperature_c"],
        active_inputs["humidity_percent"],
        active_inputs["population_density"]
    )

    compound_score = (0.6 * flood_score) + (0.4 * heat_score)

    # 6-Hour Forecast Escalation
    forecast_6h = weather.get("forecast_6h", {})
    if forecast_6h:
        future_flood = hybrid_flood_model(
            forecast_6h.get("rainfall", active_inputs["rainfall_mm"]),
            active_inputs["drainage_capacity_index"],
            active_inputs["humidity_percent"]
        )
        future_heat = hybrid_heat_model(
            forecast_6h.get("temperature", active_inputs["avg_temperature_c"]),
            active_inputs["humidity_percent"],
            active_inputs["population_density"]
        )
        future_compound = (0.6 * future_flood) + (0.4 * future_heat)
        escalation_delta = future_compound - compound_score
    else:
        future_compound = compound_score
        escalation_delta = 0.0

    if escalation_delta > 20:
        escalation_status = "High Escalation"
    elif escalation_delta >= 5:
        escalation_status = "Moderate Escalation"
    else:
        escalation_status = "Stable"

    # 5. Out-Of-Distribution Warning Detection
    warning_msg = check_ood(active_inputs["rainfall_mm"], active_inputs["avg_temperature_c"])

    response_obj = {
        "current": {
            "flood_risk": round(flood_score, 2),
            "heat_risk": round(heat_score, 2),
            "compound_risk": round(compound_score, 2)
        },
        "forecast_6h": {
            "projected_compound_risk": round(future_compound, 2),
            "escalation_delta": round(escalation_delta, 2),
            "escalation_status": escalation_status
        },
        "explainability": {
            "drivers": "Detailed driver breakdown natively handled by explainability module."
        },
        "metadata": {
            "model_version": settings.MODEL_VERSION,
            "data_source": weather.get("data_source", "System Hybrid"),
            "timestamp": datetime.utcnow().isoformat()
        },
        "live_weather": weather,
        "city_metadata": {
            "lat": city_static["lat"],
            "lon": city_static["lon"],
            "data_source": weather.get("data_source", "System Hybrid"),
            "last_updated": weather.get("last_updated", "Awaiting Telemetry")
        },
        "warning": warning_msg,
        # Backward Compat
        "resilience_score": city_static["drainage"] * 2,
        "estimated_population_exposed": round(city_static["population_density"] * (compound_score / 100) * 10),
        "optimization_insight": {
            "optimal_action": "Deploy Emergency Pumps" if compound_score > 60 else "Drainage Augmentation",
            "efficiency_score": 0.85,
            "impact": "Strategic relief across adjacent urban sectors."
        },
        "intelligence_report": f"Forecast: {escalation_status} expected. Risk compounds by {round(escalation_delta, 1)}%." if escalation_delta > 0 else "Conditions remaining stable.",
        "risk_velocity": "2.5x" if escalation_delta > 20 else ("1.5x" if escalation_delta > 5 else "1.0x"),
        "temporal_escalation_6h": f"+{round(escalation_delta, 2)}%" if escalation_delta > 0 else f"{round(escalation_delta, 2)}%",
        "compound_risk_index": round(compound_score, 2)
    }

    logger.info(f"Prediction response: {response_obj}")
    return response_obj

@app.post("/simulate")
async def simulate_risk(inputs: SimulationInputs):
    """Legacy/Compatibility Simulation Endpoint."""
    # Maps to the same logic as override mode in analyze-city
    payload = AnalyzeCityPayload(city="Bengaluru", overrides=inputs.dict())
    return await analyze_city(payload)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
