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

/**
 * Standardizes zone adjustments as per Master Prompt 3.
 * Returns a new zone object with adjusted climate values.
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
        // Secondary effects: Humidity fluctuates with rainfall
        humidity_percent: Math.min(100, baseZone.humidity_percent + (rainfallChangePercent * 0.2))
    };
}

export const INITIAL_ZONES: ZoneData[] = [
    { id: 'Z1', name: 'Downtown Core', rainfall_mm: 80, temperature_c: 32, humidity_percent: 65, drainage_index: 0.1, elevation_index: 0.1, soil_absorption: 0.1, population_density_index: 0.9, urban_heat_index: 0.8 },
    { id: 'Z2', name: 'Industrial East', rainfall_mm: 75, temperature_c: 34, humidity_percent: 60, drainage_index: 0.4, elevation_index: 0.4, soil_absorption: 0.2, population_density_index: 0.6, urban_heat_index: 0.9 },
    { id: 'Z3', name: 'Waterfront West', rainfall_mm: 90, temperature_c: 30, humidity_percent: 75, drainage_index: 0.2, elevation_index: 0.05, soil_absorption: 0.3, population_density_index: 0.7, urban_heat_index: 0.5 },
    { id: 'Z4', name: 'Uptown Residential', rainfall_mm: 65, temperature_c: 28, humidity_percent: 55, drainage_index: 0.8, elevation_index: 0.8, soil_absorption: 0.7, population_density_index: 0.4, urban_heat_index: 0.3 },
    { id: 'Z5', name: 'Tech Park South', rainfall_mm: 70, temperature_c: 31, humidity_percent: 62, drainage_index: 0.6, elevation_index: 0.5, soil_absorption: 0.5, population_density_index: 0.5, urban_heat_index: 0.6 },
    { id: 'Z6', name: 'Greenwood Buffer', rainfall_mm: 60, temperature_c: 26, humidity_percent: 50, drainage_index: 0.9, elevation_index: 0.9, soil_absorption: 0.9, population_density_index: 0.2, urban_heat_index: 0.1 }
];
