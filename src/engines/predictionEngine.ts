import { FeatureCollection, Point } from 'geojson';

export interface RiskOutput {
    score: number;
    category: 'Low' | 'Moderate' | 'High' | 'Critical' | 'Mild' | 'Severe' | 'Extreme' | 'Emergency';
    uncertainty: number;
    explanation: string;
    delta?: number;
    anomaly?: number;
    collapseProb?: number;
    riskVelocity?: number;
    humanitarianImpact?: number;
}

export interface PredictionResults {
    flood_risk_index: number;
    heat_risk_index: number;
    compound_risk_index: number;
    risk_category: 'Low' | 'Moderate' | 'High' | 'Critical';
    model_confidence: number;
}

/**
 * PHASE 4: Hybrid Disaster Scoring Model
 * Provides explainable indices based on environmental and urban parameters.
 */
export function calculateRiskMetrics(inputs: {
    rainfall: number;
    temperature: number;
    humidity: number;
    populationDensity: number;
    drainageCapacity: number;
}): PredictionResults {
    // Normalization: Ensure inputs are within expected bounds for calculation
    const rainfallFactor = Math.min(1, inputs.rainfall / 250);
    const tempFactor = Math.min(1, Math.max(0, (inputs.temperature - 15) / 35)); // Range 15-50C
    const humidityFactor = inputs.humidity / 100;

    // 1. Flood Risk Index (0-100)
    // Driven by rainfall intensity (70%) and lack of drainage (30%)
    const floodScore = (rainfallFactor * 0.7) + ((1 - inputs.drainageCapacity) * 0.3);
    const flood_risk_index = Math.round(floodScore * 100);

    // 2. Heat Risk Index (0-100)
    // Driven by temperature (60%), humidity load (20%), and population density (20%)
    const heatScore = (tempFactor * 0.6) + (humidityFactor * 0.2) + (inputs.populationDensity * 0.2);
    const heat_risk_index = Math.round(heatScore * 100);

    // 3. Compound Risk Index (0-100)
    // Weighted synthesis reflecting overall urban pressure
    const compound_risk_index = Math.round((flood_risk_index * 0.5) + (heat_risk_index * 0.5));

    // Risk Categorization
    let risk_category: PredictionResults['risk_category'] = 'Low';
    if (compound_risk_index > 75) risk_category = 'Critical';
    else if (compound_risk_index > 50) risk_category = 'High';
    else if (compound_risk_index > 25) risk_category = 'Moderate';

    // Model Confidence (Approximate certainty based on metric alignment)
    const model_confidence = 94.5 - (Math.abs(flood_risk_index - heat_risk_index) * 0.05);

    return {
        flood_risk_index,
        heat_risk_index,
        compound_risk_index,
        risk_category,
        model_confidence: Math.round(model_confidence * 10) / 10
    };
}

export interface FloodInputs {
    rainfall_mm: number;
    drainage_index: number;
    elevation_index: number;
    soil_absorption: number;
    historical_flood_factor: number;
    pop_density?: number;
}

export interface HeatInputs {
    temperature_c: number;
    humidity_percent: number;
    urban_heat_index: number;
    population_density_index: number;
    green_cover?: number;
}

export interface ZoneData {
    id: string;
    name: string;
    rainfall_mm: number;
    temperature_c: number;
    humidity_percent: number;
    drainage_index: number;
    elevation_index: number;
    soil_absorption: number;
    population_density_index: number;
    urban_heat_index: number;
}

// Upgrade 8: Seasonal Baselines for Anomaly Detection
const SEASONAL_RAIN_MEAN = 85;
const SEASONAL_RAIN_STD = 87;

/**
 * Calculates flood risk based on hydrological and infrastructure factors.
 */
export const calculateFloodRisk = (inputs: FloodInputs): RiskOutput => {
    const anomaly = (inputs.rainfall_mm - SEASONAL_RAIN_MEAN) / SEASONAL_RAIN_STD;
    const anomalyPenalty = Math.max(0, anomaly * 0.12);

    const soilSaturation = Math.min(1.0, (inputs.rainfall_mm / 200) * 0.8);
    const z = (0.03 * inputs.rainfall_mm) + (0.05 * soilSaturation * 100) - (0.04 * inputs.drainage_index * 100) - 2.0;
    const collapseProb = 1 / (1 + Math.exp(-z));

    const rainFactor = (inputs.rainfall_mm / 250);
    const elevationWeight = 1 - inputs.elevation_index;
    const absorptionOffset = inputs.soil_absorption * 0.15;

    let score = (
        (rainFactor * 0.40) +
        ((1 - inputs.drainage_index) * 0.20) +
        (elevationWeight * 0.15) +
        (inputs.historical_flood_factor * 0.05) +
        anomalyPenalty
    );

    if (collapseProb > 0.6) {
        score += 0.15;
    }

    score = Math.min(1.0, Math.max(0, score - absorptionOffset));

    let category: RiskOutput['category'] = 'Low';
    if (score > 0.85) category = 'Critical';
    else if (score > 0.65) category = 'High';
    else if (score > 0.35) category = 'Moderate';

    const uncertainty = 0.05 + (inputs.rainfall_mm > 150 ? 0.1 : 0.02) - (inputs.historical_flood_factor * 0.03);

    const explanation = score > 0.7
        ? `CRITICAL SATURATION: ${inputs.rainfall_mm.toFixed(0)}mm rainfall exceeds drainage capacity. Anomaly: +${anomaly.toFixed(1)}σ.`
        : `Hydrological stress within manageable limits. Elevation leverage: ${(inputs.elevation_index * 100).toFixed(0)}%.`;

    return { score, category, uncertainty: Math.max(0, uncertainty), explanation, anomaly, collapseProb };
};

/**
 * Calculates heat risk based on thermal and urban density factors.
 */
export const calculateHeatRisk = (inputs: HeatInputs): RiskOutput => {
    const tempFactor = (inputs.temperature_c / 50);
    const humidityLoad = (inputs.humidity_percent / 100) * 0.15;

    let score = (
        (tempFactor * 0.50) +
        (inputs.urban_heat_index * 0.30) +
        (inputs.population_density_index * 0.20)
    );

    score += humidityLoad;
    score = Math.min(1.0, Math.max(0, score));

    let category: RiskOutput['category'] = 'Mild';
    if (score > 0.85) category = 'Emergency';
    else if (score > 0.65) category = 'Extreme';
    else if (score > 0.45) category = 'Severe';

    const uncertainty = 0.02 + (inputs.temperature_c > 35 ? 0.05 : 0.01);

    const explanation = score > 0.8
        ? `THERMAL EMERGENCY: ${inputs.temperature_c.toFixed(1)}°C dangerous in high-density zones.`
        : `Ambient thermal load ${inputs.temperature_c.toFixed(1)}°C nominal.`;

    return { score, category, uncertainty, explanation };
};

/**
 * Generates an intelligence report based on combined risks.
 */
export const generateIntelligenceReport = (flood: RiskOutput, heat: RiskOutput, compound: number, velocity: number): string => {
    const insights: string[] = [];

    if (flood.anomaly && flood.anomaly > 2.0) {
        insights.push("Rainfall levels are critically above seasonal norms (Extreme Anomaly).");
    } else if (flood.anomaly && flood.anomaly > 1.0) {
        insights.push("Precipitation is trending significantly higher than historical averages.");
    }

    if (flood.collapseProb && flood.collapseProb > 0.7) {
        insights.push("CRITICAL: Drainage infrastructure is likely to fail under current hydraulic load.");
    } else if (flood.collapseProb && flood.collapseProb > 0.4) {
        insights.push("Warning: Infrastructure stress detected; drainage efficiency declining.");
    }

    if (velocity > 0.5) {
        insights.push("Risk levels are accelerating rapidly; immediate intervention recommended.");
    }

    if (heat.score > 0.75) {
        insights.push("Extreme thermal stress detected; potential for urban heat island amplification.");
    }

    if (insights.length === 0) {
        insights.push("Urban systems performing within stable operational parameters.");
    }

    return insights.join(" ");
};

/**
 * Standardizes zone adjustments for climate scenarios.
 */
export function applyScenarioAdjustment(
    baseZone: ZoneData,
    rainfallChangePercent: number,
    temperatureChangePercent: number
): ZoneData {
    return {
        ...baseZone,
        rainfall_mm: baseZone.rainfall_mm * (1 + rainfallChangePercent / 100),
        temperature_c: baseZone.temperature_c + temperatureChangePercent,
        humidity_percent: Math.min(100, baseZone.humidity_percent + (rainfallChangePercent * 0.2))
    };
}

/**
 * Generates synthetic urban zones with risk data for mapping.
 */
export const generateSyntheticZones = (): FeatureCollection<Point> => {
    return {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                properties: { id: 'Z1', risk: 0.6, name: 'Downtown Core' },
                geometry: { type: 'Point', coordinates: [-74.006, 40.7128] }
            },
            {
                type: 'Feature',
                properties: { id: 'Z2', risk: 0.3, name: 'Industrial East' },
                geometry: { type: 'Point', coordinates: [-73.986, 40.7228] }
            },
            {
                type: 'Feature',
                properties: { id: 'Z3', risk: 0.8, name: 'Waterfront West' },
                geometry: { type: 'Point', coordinates: [-74.020, 40.7028] }
            },
            {
                type: 'Feature',
                properties: { id: 'Z4', risk: 0.2, name: 'Uptown Residential' },
                geometry: { type: 'Point', coordinates: [-73.966, 40.7828] }
            },
            {
                type: 'Feature',
                properties: { id: 'Z5', risk: 0.5, name: 'Tech Park South' },
                geometry: { type: 'Point', coordinates: [-74.010, 40.6928] }
            },
            {
                type: 'Feature',
                properties: { id: 'Z6', risk: 0.1, name: 'Greenway Outskirts' },
                geometry: { type: 'Point', coordinates: [-73.950, 40.7928] }
            }
        ]
    };
};

export const INITIAL_ZONES: ZoneData[] = [
    { id: 'Z1', name: 'Downtown Core', rainfall_mm: 80, temperature_c: 32, humidity_percent: 65, drainage_index: 0.1, elevation_index: 0.1, soil_absorption: 0.1, population_density_index: 0.9, urban_heat_index: 0.8 },
    { id: 'Z2', name: 'Industrial East', rainfall_mm: 75, temperature_c: 34, humidity_percent: 60, drainage_index: 0.4, elevation_index: 0.4, soil_absorption: 0.2, population_density_index: 0.6, urban_heat_index: 0.9 },
    { id: 'Z3', name: 'Waterfront West', rainfall_mm: 90, temperature_c: 30, humidity_percent: 75, drainage_index: 0.2, elevation_index: 0.05, soil_absorption: 0.3, population_density_index: 0.7, urban_heat_index: 0.5 },
    { id: 'Z4', name: 'Uptown Residential', rainfall_mm: 65, temperature_c: 28, humidity_percent: 55, drainage_index: 0.8, elevation_index: 0.8, soil_absorption: 0.7, population_density_index: 0.4, urban_heat_index: 0.3 },
    { id: 'Z5', name: 'Tech Park South', rainfall_mm: 70, temperature_c: 31, humidity_percent: 62, drainage_index: 0.6, elevation_index: 0.5, soil_absorption: 0.5, population_density_index: 0.5, urban_heat_index: 0.6 },
    { id: 'Z6', name: 'Greenwood Buffer', rainfall_mm: 60, temperature_c: 26, humidity_percent: 50, drainage_index: 0.9, elevation_index: 0.9, soil_absorption: 0.9, population_density_index: 0.2, urban_heat_index: 0.1 }
];
