import { useState } from 'react';
import { apiClient } from '../services/apiClient';
import { Coordinates } from '../types';
import { logger } from '../utils/logger';

export interface StressTestResponse {
    overallRisk: number;
    details: any;
}

export function useRiskPrediction() {
    const [prediction, setPrediction] = useState<StressTestResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const runPrediction = async (coords: Coordinates) => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiClient.fetch<StressTestResponse>('/api/stress-test', {
                method: 'POST',
                body: JSON.stringify({ lat: coords.lat, lng: coords.lng })
            });

            if (response.success && response.data) {
                setPrediction(response.data);
            } else {
                throw new Error(response.error || 'Failed to get prediction');
            }
        } catch (err: any) {
            logger.error('Prediction hook error', err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { prediction, loading, error, runPrediction, setPrediction };
}
