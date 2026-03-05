import os
import joblib
import pandas as pd
from datetime import datetime
from .config import settings

# Load models from the new sibling directory
FLOOD_MODEL_PATH = os.path.join(settings.MODEL_DIR, "flood_model.pkl")
HEAT_MODEL_PATH = os.path.join(settings.MODEL_DIR, "heat_model.pkl")

def _load_model(path):
    return joblib.load(path)

# Global model cache for efficiency
try:
    flood_model = _load_model(FLOOD_MODEL_PATH)
    heat_model = _load_model(HEAT_MODEL_PATH)
except Exception as e:
    print(f"Warning: Models failed to load: {e}")
    flood_model = None
    heat_model = None

def check_ood(rainfall, temp):
    """Out-of-Distribution Check for extreme anomalies."""
    warnings = []
    if rainfall > 400:
        warnings.append("Input outside trained range (Rainfall > 400mm). Confidence reduced.")
    if temp > 55:
        warnings.append("Input outside trained range (Temperature > 55°C). Confidence reduced.")
    return " | ".join(warnings) if warnings else None

def hybrid_flood_model(rainfall, drainage_pct, humidity):
    """
    Hybrid logic: Rule-based (Rainfall Pressure) + XGBoost ML Prediction.
    """
    # 1. Physically Grounded Component: Rainfall Pressure Ratio
    drainage_ratio = drainage_pct / 100.0 if drainage_pct > 0 else 0.01
    rainfall_pressure = rainfall / drainage_ratio
    rule_score = min(rainfall_pressure * 0.4, 100)

    # 2. ML Component (Pattern recognition)
    if flood_model:
        try:
            input_df = pd.DataFrame(
                [[rainfall, drainage_pct, humidity]], 
                columns=['rainfall_mm', 'drainage_capacity_index', 'humidity_percent']
            )
            ml_score = float(flood_model.predict(input_df)[0])
        except Exception as e:
            print(f"Flood ML error: {e}")
            ml_score = 50.0
    else:
        ml_score = 50.0

    final = (0.6 * rule_score) + (0.4 * ml_score)

    # 3. Seasonal Baseline (Monsoon Adjustment)
    month = datetime.utcnow().month
    if month in [6, 7, 8, 9]:
        final *= 1.1

    return float(max(min(final, 100.0), 0.0))

def calculate_heat_index(T, RH):
    """NOAA Heat Index formula."""
    T = T * 9/5 + 32  # convert to F
    HI = (-42.379 + 2.04901523*T + 10.14333127*RH
          - 0.22475541*T*RH - 0.00683783*T*T
          - 0.05481717*RH*RH
          + 0.00122874*T*T*RH
          + 0.00085282*T*RH*RH
          - 0.00000199*T*T*RH*RH)
    return (HI - 32) * 5/9  # convert back to C

def hybrid_heat_model(temp, humidity, pop_density):
    """
    Hybrid logic: NOAA Heat Index + XGBoost ML Prediction.
    """
    # 1. Physically Grounded Rule: NOAA Heat Index
    heat_index_c = calculate_heat_index(temp, humidity)
    hi_score = max((heat_index_c - 30) * 5, 0)
    pop_penalty = pop_density * 0.002
    rule_score = min(hi_score + pop_penalty, 100)

    # 2. ML Component
    if heat_model:
        try:
            input_df = pd.DataFrame(
                [[temp, humidity]], 
                columns=['avg_temperature_c', 'humidity_percent']
            )
            ml_score = float(heat_model.predict(input_df)[0])
        except Exception as e:
            print(f"Heat ML error: {e}")
            ml_score = 50.0
    else:
        ml_score = 50.0

    final = (0.6 * rule_score) + (0.4 * ml_score)
    return float(max(min(final, 100.0), 0.0))
