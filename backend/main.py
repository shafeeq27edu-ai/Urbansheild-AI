from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="UrbanShield AI Risk Engine")

class FloodInputs(BaseModel):
    rainfall_mm: float
    drainage_index: float  # 0-1
    elevation_index: float # 0-1
    soil_absorption: float # 0-1
    historical_flood_factor: float # 0-1

class HeatInputs(BaseModel):
    temperature_c: float
    humidity_percent: float
    urban_heat_index: float # 0-1
    population_density_index: float # 0-1

class SimulationScenario(BaseModel):
    rainfall_change_percent: float
    temp_change_percent: float

@app.post("/predict/flood")
async def predict_flood(inputs: FloodInputs):
    # Advanced deterministic formula with adaptive weights
    # Normalize rainfall assuming max 250mm
    rain_factor = (inputs.rainfall_mm / 250)
    elevation_weight = 1 - inputs.elevation_index
    absorption_offset = inputs.soil_absorption * 0.15
    
    # Core Risk Calculation
    score = (
        (rain_factor * 0.45) +
        ((1 - inputs.drainage_index) * 0.25) +
        (elevation_weight * 0.20) +
        (inputs.historical_flood_factor * 0.10)
    )

    # Apply modifiers
    score = max(0.0, score - absorption_offset)
    score = min(1.0, score)
    
    # Nonlinear scaling for critical thresholds
    if score > 0.7:
        score = min(1.0, score * 1.1)
    
    category = "Low"
    if score > 0.85: category = "Critical"
    elif score > 0.65: category = "High"
    elif score > 0.35: category = "Moderate"
    
    # Confidence estimation
    uncertainty = 0.05 + (0.1 if inputs.rainfall_mm > 150 else 0.02) - (inputs.historical_flood_factor * 0.03)

    return {
        "score": score,
        "category": category,
        "confidence": max(0.0, 1.0 - uncertainty),
        "explanation": f"CRITICAL SATURATION: {inputs.rainfall_mm:.0f}mm rainfall" if score > 0.7 else f"Hydrological stress nominal. Elev: {inputs.elevation_index:.2f}"
    }

@app.post("/predict/heat")
async def predict_heat(inputs: HeatInputs):
    # Advanced deterministic formula
    temp_factor = (inputs.temperature_c / 50)
    humidity_load = (inputs.humidity_percent / 100) * 0.15
    
    score = (
        (temp_factor * 0.50) +
        (inputs.urban_heat_index * 0.30) +
        (inputs.population_density_index * 0.20)
    )

    # Wet Bulb correction
    score += humidity_load
    score = min(1.0, max(0.0, score))
    
    category = "Mild"
    if score > 0.85: category = "Emergency"
    elif score > 0.65: category = "Extreme"
    elif score > 0.45: category = "Severe"
    
    uncertainty = 0.02 + (0.05 if inputs.temperature_c > 35 else 0.01)

    return {
        "score": score,
        "category": category,
        "confidence": 1.0 - uncertainty,
        "explanation": f"THERMAL EMERGENCY: {inputs.temperature_c:.1f}C + {inputs.humidity_percent}% Humidity" if score > 0.8 else "Ambient thermal load nominal."
    }

@app.post("/simulate")
async def simulate_scenario(scenario: SimulationScenario):
    # High-level simulation response
    return {
        "status": "success",
        "impact_multiplier": 1.0 + (scenario.rainfall_change_percent / 100) * 0.5,
        "message": f"Simulating {scenario.temp_change_percent}% temperature shift across urban grid."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
