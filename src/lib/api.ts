export type PredictionResponse = {
    current: {
        flood_risk: number;
        heat_risk: number;
        compound_risk: number;
    };
    forecast_6h: {
        projected_compound_risk: number;
        escalation_delta: number;
        escalation_status: string;
    };
    explainability: Record<string, string>;
    metadata: {
        model_version: string;
        data_source: string;
        timestamp: string;
    };
    live_weather?: any;
    city_metadata?: any;
    warning?: string;
    intelligence_report?: string;
    optimization_insight?: any;
    resilience_score?: number;
    estimated_population_exposed?: number;
    risk_velocity?: string;
    temporal_escalation_6h?: string;
    compound_risk_index?: number;
};

export async function runPrediction(payload: any) {
    const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        throw new Error("Backend API failed");
    }

    const data = await res.json();
    console.log("API data received:", data);
    return data;
}

export async function checkHealth() {
    try {
        const res = await fetch("/api/health");
        if (!res.ok) throw new Error("Health check failed");
        return await res.json();
    } catch {
        return { status: "offline", model_loaded: false, weather_api_reachable: false };
    }
}
