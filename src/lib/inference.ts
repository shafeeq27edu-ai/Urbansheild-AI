export interface RiskOutput {
    score: number;
    category: 'Low' | 'Moderate' | 'High' | 'Critical' | 'Mild' | 'Severe' | 'Extreme' | 'Emergency';
    uncertainty: number;
    explanation: string;
    delta?: number;
}

export interface FloodInputs {
    rainfall_mm: number;
    drainage_index: number;
    elevation_index: number;
    soil_absorption: number;
    historical_flood_factor: number;
}

export interface HeatInputs {
    temperature_c: number;
    humidity_percent: number;
    urban_heat_index: number;
    population_density_index: number;
}

export const calculateFloodRisk = (inputs: FloodInputs): RiskOutput => {
    // Advanced deterministic formula with adaptive weights
    const rainFactor = (inputs.rainfall_mm / 250); // Normalize assuming max 250mm
    const elevationWeight = 1 - inputs.elevation_index; // Lower elevation = higher risk
    const absorptionOffset = inputs.soil_absorption * 0.15;

    // Core Risk Calculation
    let score = (
        (rainFactor * 0.45) +
        ((1 - inputs.drainage_index) * 0.25) +
        (elevationWeight * 0.20) +
        (inputs.historical_flood_factor * 0.10)
    );

    // Apply modifiers
    score = Math.max(0, score - absorptionOffset);
    score = Math.min(1.0, score);

    // Nonlinear scaling for critical thresholds
    if (score > 0.7) score = Math.min(1, score * 1.1);

    let category: RiskOutput['category'] = 'Low';
    if (score > 0.85) category = 'Critical';
    else if (score > 0.65) category = 'High';
    else if (score > 0.35) category = 'Moderate';

    // Confidence estimation based on parameter variance (heuristic)
    const uncertainty = 0.05 + (inputs.rainfall_mm > 150 ? 0.1 : 0.02) - (inputs.historical_flood_factor * 0.03);

    const explanation = score > 0.7
        ? `CRITICAL SATURATION: ${inputs.rainfall_mm.toFixed(0)}mm rainfall exceeds drainage capacity (${(inputs.drainage_index * 100).toFixed(0)}%). Soil absorption insufficient.`
        : `Hydrological stress within manageable limits. Elevation leverage: ${(inputs.elevation_index * 100).toFixed(0)}%.`;

    return { score, category, uncertainty: Math.max(0, uncertainty), explanation };
};

export const calculateHeatRisk = (inputs: HeatInputs): RiskOutput => {
    // Advanced deterministic formula
    const tempFactor = (inputs.temperature_c / 50); // Normalize assuming max 50C
    const humidityLoad = (inputs.humidity_percent / 100) * 0.15;

    let score = (
        (tempFactor * 0.50) +
        (inputs.urban_heat_index * 0.30) +
        (inputs.population_density_index * 0.20)
    );

    // Wet Bulb correction
    score += humidityLoad;
    score = Math.min(1.0, Math.max(0, score));

    let category: RiskOutput['category'] = 'Mild';
    if (score > 0.85) category = 'Emergency';
    else if (score > 0.65) category = 'Extreme';
    else if (score > 0.45) category = 'Severe';

    const uncertainty = 0.02 + (inputs.temperature_c > 35 ? 0.05 : 0.01);

    const explanation = score > 0.8
        ? `THERMAL EMERGENCY: ${inputs.temperature_c.toFixed(1)}°C + ${inputs.humidity_percent}% Humidity creates wet-bulb danger in high-density zones.`
        : `Ambient thermal load ${inputs.temperature_c.toFixed(1)}°C. Urban Heat Island effect nominal.`;

    return { score, category, uncertainty, explanation };
};
