import requests
import time

class WeatherService:
    def __init__(self, cache_duration=600): # 10 minutes cache
        self.cache = {}
        self.cache_duration = cache_duration

    def fetch_live_weather(self, lat, lon, city_name):
        current_time = time.time()
        
        # Check cache
        if city_name in self.cache:
            data, timestamp = self.cache[city_name]
            if current_time - timestamp < self.cache_duration:
                print(f"DEBUG: Returning cached weather for {city_name}")
                return data

        print(f"DEBUG: Fetching live weather for {city_name} from Open-Meteo")
        url = (
            f"https://api.open-meteo.com/v1/forecast"
            f"?latitude={lat}&longitude={lon}"
            f"&current=temperature_2m,relative_humidity_2m,precipitation"
        )

        try:
            response = requests.get(url, timeout=5)
            response.raise_for_status()
            data = response.json()
            
            current = data.get("current", {})
            weather_data = {
                "avg_temperature_c": current.get("temperature_2m", 25.0),
                "humidity_percent": current.get("relative_humidity_2m", 50.0),
                "rainfall_mm": current.get("precipitation", 0.0),
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime())
            }
            
            # Save to cache
            self.cache[city_name] = (weather_data, current_time)
            return weather_data
            
        except Exception as e:
            print(f"ERROR: Failed to fetch weather for {city_name}: {e}")
            # Fallback to safe defaults if API fails
            return {
                "avg_temperature_c": 28.0,
                "humidity_percent": 60.0,
                "rainfall_mm": 0.0,
                "timestamp": "fallback_default"
            }

# Singleton instance
weather_service = WeatherService()
