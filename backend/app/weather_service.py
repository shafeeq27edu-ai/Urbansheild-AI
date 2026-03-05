import requests
from .cache import get_cached, set_cache
from .config import settings

def fetch_open_meteo(city_name: str, lat: float, lon: float) -> dict:
    """
    Fetches real-time weather from Open-Meteo with caching and fallback.
    """
    cached = get_cached(city_name)
    if cached:
        return cached

    if settings.DEMO_MODE:
        return {
            "temperature": 30.0,
            "humidity": 70.0,
            "rainfall": 10.0
        }

    url = (
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}"
        f"&current=temperature_2m,relative_humidity_2m,precipitation"
        f"&hourly=temperature_2m,precipitation&forecast_days=1"
    )

    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
        current = data.get("current", {})
        hourly = data.get("hourly", {})
        
        hourly_precip = hourly.get("precipitation", [])[:6]
        hourly_temp = hourly.get("temperature_2m", [])[:6]
        
        cumulative_rainfall_6h = sum(hourly_precip) if hourly_precip else 0
        max_temp_6h = max(hourly_temp) if hourly_temp else current.get("temperature_2m", 30.0)

        weather = {
            "temperature": current.get("temperature_2m", 30.0),
            "humidity": current.get("relative_humidity_2m", 65.0),
            "rainfall": current.get("precipitation", 0.0),
            "forecast_6h": {
                "rainfall": cumulative_rainfall_6h,
                "temperature": max_temp_6h
            },
            "data_source": "Open-Meteo Live",
            "last_updated": current.get("time", "Unknown")
        }

        set_cache(city_name, weather)
        return weather

    except Exception as e:
        # Fallback safe baseline
        return {
            "temperature": 30.0,
            "humidity": 65.0,
            "rainfall": 5.0,
            "data_source": "Fallback Baseline",
            "last_updated": "Station Offline"
        }
