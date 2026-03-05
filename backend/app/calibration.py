import numpy as np
from .config import settings

def get_adaptive_flood_score(inputs: dict, baselines: dict, stats: dict) -> float:
    """
    Continuous penalty functions for realistic risk growth.
    """
    precip = inputs.get("rainfall_mm", 0)
    drainage = inputs.get("drainage_capacity_index", 50)
    elev = inputs.get("elevation_index", 50)

    # Seasonal anomaly detection
    seasonal_mean = baselines.get("rainfall_mm", 85)
    seasonal_std = stats.get("rainfall_mm", {}).get("std", 87)
    rainfall_anomaly = (precip - seasonal_mean) / seasonal_std

    # Adaptive scaling influenced by anomaly
    anomaly_penalty = max(0, rainfall_anomaly * 12)
    rainfall_penalty = min(max(0, (precip - 120) * 0.15), 25)
    drainage_penalty = (100 - drainage) * 0.2
    elevation_penalty = (100 - elev) * 0.1

    base = (precip / 300) * 40
    return min(
        100,
        base
        + rainfall_penalty
        + drainage_penalty
        + elevation_penalty
        + anomaly_penalty,
    )

def get_adaptive_heat_score(inputs: dict) -> float:
    temp = inputs.get("avg_temperature_c", 30)
    green = inputs.get("green_cover_percent", 20)
    humidity = inputs.get("humidity_percent", 50)

    temp_penalty = min(max(0, (temp - 38) * 2.0), 30)
    green_penalty = (60 - green) * 0.25
    humidity_penalty = max(0, (humidity - 70) * 0.5)

    base = ((temp - 15) / 35) * 45
    return min(100, base + temp_penalty + green_penalty + humidity_penalty)
