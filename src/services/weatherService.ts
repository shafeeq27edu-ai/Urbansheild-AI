import { logger } from '../utils/logger';

export interface WeatherData {
    temperature: number;
    windSpeed: number;
    precipitation: number;
}

let lastKnownWeather: WeatherData | null = null;

export const weatherService = {
    async fetchWeather(lat: number, lng: number): Promise<WeatherData | null> {
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Weather API failed');
            }

            const data = await response.json();

            const weatherData: WeatherData = {
                temperature: data.current_weather.temperature,
                windSpeed: data.current_weather.windspeed,
                precipitation: data.current_weather.precipitation || 0,
            };

            lastKnownWeather = weatherData;
            return weatherData;
        } catch (error: any) {
            logger.warn('Weather fetch failed, using fallback', error.message);
            return lastKnownWeather; // Fallback to last known to prevent UI crashes
        }
    }
};
