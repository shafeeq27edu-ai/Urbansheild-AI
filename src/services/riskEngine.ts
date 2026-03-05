import { logger } from '../utils/logger';
import { weatherService, WeatherData } from './weatherService';

export interface RiskPrediction {
    overallRisk: number;
    factors: {
        weatherRisk: number;
        infrastructureRisk: number;
    };
    recommendations: string[];
}

export const riskEngine = {
    async calculateRisk(lat: number, lng: number, infrastructureData: any): Promise<RiskPrediction> {
        try {
            const weather = await weatherService.fetchWeather(lat, lng);

            let weatherRisk = 0;
            if (weather) {
                weatherRisk = (weather.windSpeed * 0.5) + (weather.precipitation * 2.0);
                weatherRisk = Math.min(100, Math.max(0, weatherRisk));
            }

            // Baseline infrastructure risk, combined with real data when available
            const infrastructureRisk = infrastructureData?.baseRisk || 20;

            const overallRisk = (weatherRisk * 0.6) + (infrastructureRisk * 0.4);

            const recommendations = [];
            if (overallRisk > 70) recommendations.push('Evacuate high risk zones');
            if (weatherRisk > 50) recommendations.push('Prepare for severe weather conditions');

            return {
                overallRisk,
                factors: {
                    weatherRisk,
                    infrastructureRisk
                },
                recommendations
            };

        } catch (error: any) {
            logger.error('Risk prediction failed', error.message);
            throw new Error('Failed to calculate risk');
        }
    }
};
