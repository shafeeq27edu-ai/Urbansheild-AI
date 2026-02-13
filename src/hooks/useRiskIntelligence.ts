import { useMemo } from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';
import { calculateFloodRisk, calculateHeatRisk, RiskOutput } from '@/lib/inference';

export interface ZoneRisk {
    id: string;
    name: string;
    flood: RiskOutput;
    heat: RiskOutput;
    baselineFlood: RiskOutput;
    baselineHeat: RiskOutput;
    stressScore: number;
    stressLevel: string;
    confidence: number;
    projections: { hour: number; flood: number; heat: number }[];
}

// EXPANDED TO 6 ZONES AS PER MEGA PROMPT
const zones = [
    { id: 'Z1', name: 'Downtown Core', elevation: 0.1, albedo: 0.2, popDensity: 0.95, drain: 0.2, soil: 0.1, humidityBase: 40, heatIndex: 0.9, floodFactor: 0.8 },
    { id: 'Z2', name: 'Industrial East', elevation: 0.3, albedo: 0.1, popDensity: 0.4, drain: 0.5, soil: 0.05, humidityBase: 35, heatIndex: 0.95, floodFactor: 0.4 },
    { id: 'Z3', name: 'Waterfront West', elevation: 0.05, albedo: 0.3, popDensity: 0.7, drain: 0.3, soil: 0.2, humidityBase: 60, heatIndex: 0.6, floodFactor: 0.9 },
    { id: 'Z4', name: 'Uptown Residential', elevation: 0.6, albedo: 0.6, popDensity: 0.5, drain: 0.7, soil: 0.6, humidityBase: 30, heatIndex: 0.4, floodFactor: 0.2 },
    { id: 'Z5', name: 'Tech Park South', elevation: 0.4, albedo: 0.5, popDensity: 0.6, drain: 0.6, soil: 0.3, humidityBase: 35, heatIndex: 0.7, floodFactor: 0.3 },
    { id: 'Z6', name: 'Greenway Outskirts', elevation: 0.8, albedo: 0.7, popDensity: 0.2, drain: 0.4, soil: 0.9, humidityBase: 45, heatIndex: 0.2, floodFactor: 0.1 },
];

export const useRiskIntelligence = () => {
    const { rainfallIncrease, tempIncrease, mitigationActive, drainageEfficiency } = useSimulationStore();

    const results = useMemo(() => {
        return zones.map(zone => {
            // DYNAMIC INPUT CALCULATION
            // 1. Rainfall MM approximation (0-200% slider maps to 0-300mm for simulation)
            const rainfallMM = (rainfallIncrease / 100) * 150;

            // 2. Drainage Index with User Override
            // If drainageEfficiency slider is used (it's a drop %), it reduces zones base drainage
            const effectiveDrainage = Math.max(0.05, zone.drain * (1 - (drainageEfficiency / 100)));

            const floodInputs = {
                rainfall_mm: rainfallMM,
                drainage_index: effectiveDrainage,
                elevation_index: zone.elevation,
                soil_absorption: zone.soil,
                historical_flood_factor: zone.floodFactor
            };

            const heatInputs = {
                temperature_c: 28 + tempIncrease, // Base 28C + increase
                humidity_percent: Math.min(100, zone.humidityBase + (rainfallIncrease * 0.1)),
                urban_heat_index: zone.heatIndex,
                population_density_index: zone.popDensity
            };

            let flood = calculateFloodRisk(floodInputs);
            let heat = calculateHeatRisk(heatInputs);

            if (mitigationActive) {
                // Heuristic improvement from policies
                flood = { ...flood, score: Math.max(0, flood.score * 0.7) };
                heat = { ...heat, score: Math.max(0, heat.score * 0.75) };
            }

            // Baselines (0 increase)
            const baselineFlood = calculateFloodRisk({ ...floodInputs, rainfall_mm: 0 });
            const baselineHeat = calculateHeatRisk({ ...heatInputs, temperature_c: 28 });

            // Confidence quantifying (heuristic)
            const confidence = Math.max(0, 95 - (rainfallIncrease / 10) - (tempIncrease * 2));

            // Infrastructure Stress (Interaction of risk and density)
            const stressScore = Math.min(1, (flood.score * 0.6 + heat.score * 0.4) * (zone.popDensity + 0.5));
            const stressLevel = stressScore > 0.8 ? 'CRITICAL' : stressScore > 0.6 ? 'HIGH' : stressScore > 0.3 ? 'MODERATE' : 'LOW';

            // 6-Hour Projections (Deterministic incremental)
            const projections = Array.from({ length: 6 }, (_, i) => ({
                hour: i + 1,
                flood: Math.min(1, flood.score * (1 + (i + 1) * 0.05)),
                heat: Math.min(1, heat.score * (1 + (i + 1) * 0.03))
            }));

            return {
                ...zone,
                flood: { ...flood, delta: flood.score - baselineFlood.score },
                heat: { ...heat, delta: heat.score - baselineHeat.score },
                baselineFlood,
                baselineHeat,
                confidence,
                stressScore,
                stressLevel,
                projections
            };
        });
    }, [rainfallIncrease, tempIncrease, mitigationActive, drainageEfficiency]);

    const cityMetrics = useMemo(() => {
        const avgFlood = results.reduce((acc, curr) => acc + curr.flood.score, 0) / results.length;
        const avgHeat = results.reduce((acc, curr) => acc + curr.heat.score, 0) / results.length;
        const avgStress = results.reduce((acc, curr) => acc + curr.stressScore, 0) / results.length;
        const criticalZones = results.filter(z => z.flood.score > 0.8 || z.heat.score > 0.8 || z.stressScore > 0.8);

        const carbonFootprint = (avgHeat * 450) + 1200; // Tons CO2e/day
        const economicLoss = (avgFlood * 12.5) + (avgHeat * 8.2); // $ Millions/day

        // NEW: Strategic Resilience Score (Inverse of stress + mitigation bonus)
        const resilienceScore = Math.max(0, Math.min(100, (1 - avgStress) * 100 + (mitigationActive ? 15 : 0)));
        const resilienceStatus = resilienceScore > 75 ? 'RESILIENT' : resilienceScore > 45 ? 'VULNERABLE' : 'HIGH RISK';

        return {
            avgFlood,
            avgHeat,
            avgStress,
            carbonFootprint: mitigationActive ? carbonFootprint * 0.82 : carbonFootprint,
            economicLoss: mitigationActive ? economicLoss * 0.65 : economicLoss,
            criticalCount: criticalZones.length,
            overallStatus: avgFlood > 0.7 || avgHeat > 0.7 ? 'SEVERE' : avgFlood > 0.4 || avgHeat > 0.4 ? 'MODERATE' : 'OPTIMAL',
            resilienceScore,
            resilienceStatus,
            topFloodZone: [...results].sort((a, b) => b.flood.score - a.flood.score)[0],
            topHeatZone: [...results].sort((a, b) => b.heat.score - a.heat.score)[0],
            rankedZones: [...results].sort((a, b) => Math.max(b.flood.score, b.heat.score) - Math.max(a.flood.score, a.heat.score))
        };
    }, [results, mitigationActive]);

    const topRiskZone = cityMetrics.topFloodZone;

    return { results, topRiskZone, cityMetrics };
};
