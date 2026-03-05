import time

_weather_cache = {}

def get_cached(city: str):
    entry = _weather_cache.get(city)
    if not entry:
        return None

    # Check TTL (10 mins by default)
    if time.time() - entry["timestamp"] > 600:
        return None

    return entry["data"]

def set_cache(city: str, data: dict):
    _weather_cache[city] = {
        "timestamp": time.time(),
        "data": data
    }
