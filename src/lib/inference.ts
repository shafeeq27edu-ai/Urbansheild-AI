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

export interface SystemicRiskOutput extends RiskOutput {
    intelligenceReport: string;
    optimalAction: string;
    uncertaintyBand: string;
    velocityScore: number;
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

// Upgrade 8: Seasonal Baselines for Anomaly Detection
const SEASONAL_RAIN_MEAN = 85;
const SEASONAL_RAIN_STD = 87;

export const calculateFloodRisk = (inputs: FloodInputs): RiskOutput => {
    // 1. Upgrade 8: Dynamic Threshold Adaptation (Climate Drift Awareness)
    const anomaly = (inputs.rainfall_mm - SEASONAL_RAIN_MEAN) / SEASONAL_RAIN_STD;
    const anomalyPenalty = Math.max(0, anomaly * 0.12);

    // 2. Upgrade 9: Infrastructure Collapse Probability
    const soilSaturation = Math.min(1.0, (inputs.rainfall_mm / 200) * 0.8);
    const z = (0.03 * inputs.rainfall_mm) + (0.05 * soilSaturation * 100) - (0.04 * inputs.drainage_index * 100) - 2.0;
    const collapseProb = 1 / (1 + Math.exp(-z));

    // Advanced deterministic formula
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

    // Apply Infrastructure Collapse Penalty (Upgrade 9)
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

// Upgrade 13: Explainable Narrative Generator (Offline)
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

