import { logger } from '@/utils/logger';

export interface WeatherData {
    temperature: number;
    humidity: number;
    rainfall: number;
    windspeed: number;
}

// Fallback values for India general baseline
const DEFAULT_WEATHER: WeatherData = {
    temperature: 28,
    humidity: 60,
    rainfall: 0,
    windspeed: 12
};

let lastKnownWeather: WeatherData | null = null;

export const weatherService = {
    async fetchWeather(lat: number, lng: number): Promise<WeatherData> {
        try {
            // Open-Meteo current telemetry extraction
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation,windspeed_10m`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Weather API Error: ${response.status}`);
            }

            const data = await response.json();
            const current = data.current;

            if (!current) {
                throw new Error("Malformed weather data received");
            }

            const weatherData: WeatherData = {
                temperature: current.temperature_2m,
                humidity: current.relative_humidity_2m,
                rainfall: current.precipitation || 0,
                windspeed: current.windspeed_10m,
            };

            lastKnownWeather = weatherData;
            logger.info(`Weather Telemetry Synced: ${lat}, ${lng} | ${weatherData.temperature}°C`);
            return weatherData;

        } catch (error: any) {
            logger.warn('Weather downlink failed, using fallback', error.message);
            return lastKnownWeather || DEFAULT_WEATHER;
        }
    }
};
