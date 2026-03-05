from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import uvicorn
from risk_engine import UrbanRiskEngine
from city_profiles import CITIES
from weather_service import weather_service as ws

app = FastAPI(title="UrbanShield Deep Intelligence Engine v2.5")
engine = UrbanRiskEngine()

class SimulationInputs(BaseModel):
    rainfall_mm: float
    avg_temperature_c: float
    humidity_percent: float
    drainage_capacity_index: float # 0-100
    green_cover_percent: float # 0-100
    population_density: float
    elevation_index: Optional[float] = 50.0
    infrastructure_strength: Optional[float] = 70.0
    emergency_response: Optional[float] = 80.0

@app.get("/health")
async def health_check():
    return {
        "status": "online", 
        "version": "2.5.0-DEEP-INTEL", 
        "engine": "Hybrid-ML-Optimization"
    }

@app.post("/simulate")
async def simulate_risk(inputs: SimulationInputs):
    try:
        data = inputs.dict()
        result = engine.calculate_risk(data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/sensitivity")
async def analyze_sensitivity(inputs: SimulationInputs):
    """
    Upgrade 5: Sensitivity Analysis for systemic volatility.
    """
    try:
        data = inputs.dict()
        sensitivity_report = engine.analyze_sensitivity(data)
        return sensitivity_report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-city")
async def analyze_city(payload: dict):
    """
    Phase 3: Real-time City Analysis Endpoint.
    Fetches live weather and merges with city infrastructure profiles.
    """
    city_key = payload.get("city", "Bengaluru")
    if city_key not in CITIES:
        raise HTTPException(status_code=404, detail="City not found in profiles")
    
    city = CITIES[city_key]
    
    target_lat = payload.get("overrides", {}).get("lat", city["lat"])
    target_lon = payload.get("overrides", {}).get("lon", city["lon"])
    
    # Use exact coordinates for cache key unless it's the exact city center
    cache_key = f"{city_key}_{target_lat}_{target_lon}"

    # 1. Fetch Live Weather
    weather = ws.fetch_live_weather(target_lat, target_lon, cache_key)
    
    # 2. Merge Data for Engine
    engine_inputs = {
        **city,
        **weather,
        # Allow optional manual overrides from frontend for "Stress Mode"
        # We need to ensure types are correct for the engine
        **{k: float(v) for k, v in payload.get("overrides", {}).items() if v is not None}
    }
    
    # 3. Process through Hybrid Risk Engine
    try:
        results = engine.calculate_risk(engine_inputs)
        
        # 4. Add metadata for Frontend
        results["city_metadata"] = {
            "name": city["name"],
            "lat": city["lat"],
            "lon": city["lon"],
            "data_source": "Open-Meteo + UrbanShield Profiles",
            "last_updated": weather["timestamp"],
            "is_live_sync": True
        }
        results["live_weather"] = weather
        
        return results
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Intelligence Error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
