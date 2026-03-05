from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from datetime import datetime

# --- Request Schemas ---

class SimulationInputs(BaseModel):
    rainfall_mm: float = Field(..., ge=0, le=500)
    avg_temperature_c: float = Field(..., ge=-10, le=60)
    humidity_percent: float = Field(default=50, ge=0, le=100)
    drainage_capacity_index: float = Field(default=50, ge=0, le=100)
    green_cover_percent: float = Field(default=20, ge=0, le=100)
    population_density: float = Field(default=5000, ge=0)
    elevation_index: float = Field(default=50, ge=0, le=100)
    infrastructure_strength: float = Field(default=70, ge=0, le=100)
    emergency_response: float = Field(default=80, ge=0, le=100)

class AnalyzeCityPayload(BaseModel):
    city: str
    overrides: Optional[Dict[str, Any]] = None

# --- Response Schemas ---

class RiskData(BaseModel):
    pass # Kept for backward compat locally if needed, but not used in PredictionResponse

class PredictionCurrent(BaseModel):
    flood_risk: float
    heat_risk: float
    compound_risk: float

class PredictionForecast(BaseModel):
    projected_compound_risk: float
    escalation_delta: float
    escalation_status: str

class PredictionMetadata(BaseModel):
    model_version: str
    data_source: str
    timestamp: str

class PredictionResponse(BaseModel):
    current: PredictionCurrent
    forecast_6h: PredictionForecast
    explainability: Dict[str, str]
    metadata: PredictionMetadata
    
    # Extra fields for frontend dashboard state (safe keeping)
    live_weather: Optional[Dict[str, Any]] = None
    city_metadata: Optional[Dict[str, Any]] = None
    warning: Optional[str] = None
    
    # Backward compat
    resilience_score: Optional[float] = None
    estimated_population_exposed: Optional[float] = None
    optimization_insight: Optional[Dict[str, Any]] = None
    intelligence_report: Optional[str] = None
    risk_velocity: Optional[str] = None
    temporal_escalation_6h: Optional[str] = None
    compound_risk_index: Optional[float] = None

class HealthStatus(BaseModel):
    status: str
    model_loaded: bool
    uptime: str
    version: str
