import { useMemo } from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';
import { calculateFloodRisk, calculateHeatRisk, generateIntelligenceReport, RiskOutput } from '@/lib/inference';

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
    humanitarianImpact: number;
    infrastructureCollapseProb: number;
    riskVelocity: number;
    intelligenceReport: string;
    optimalAction: string;
    uncertaintyBand: string;
}

// EXPANDED TO 6 ZONES AS PER MEGA PROMPT
const zones = [
    { id: 'Z1', name: 'Downtown Core', elevation: 0.1, albedo: 0.2, popDensity: 0.95, drain: 0.2, soil: 0.1, humidityBase: 40, heatIndex: 0.9, floodFactor: 0.8, slumRatio: 0.1 },
    { id: 'Z2', name: 'Industrial East', elevation: 0.3, albedo: 0.1, popDensity: 0.4, drain: 0.5, soil: 0.05, humidityBase: 35, heatIndex: 0.95, floodFactor: 0.4, slumRatio: 0.25 },
    { id: 'Z3', name: 'Waterfront West', elevation: 0.05, albedo: 0.3, popDensity: 0.7, drain: 0.3, soil: 0.2, humidityBase: 60, heatIndex: 0.6, floodFactor: 0.9, slumRatio: 0.15 },
    { id: 'Z4', name: 'Uptown Residential', elevation: 0.6, albedo: 0.6, popDensity: 0.5, drain: 0.7, soil: 0.6, humidityBase: 30, heatIndex: 0.4, floodFactor: 0.2, slumRatio: 0.02 },
    { id: 'Z5', name: 'Tech Park South', elevation: 0.4, albedo: 0.5, popDensity: 0.6, drain: 0.6, soil: 0.3, humidityBase: 35, heatIndex: 0.7, floodFactor: 0.3, slumRatio: 0.05 },
    { id: 'Z6', name: 'Greenway Outskirts', elevation: 0.8, albedo: 0.7, popDensity: 0.2, drain: 0.4, soil: 0.9, humidityBase: 45, heatIndex: 0.2, floodFactor: 0.1, slumRatio: 0.01 },
];

export const useRiskIntelligence = () => {
    const { rainfallIncrease, tempIncrease, mitigationActive, drainageEfficiency } = useSimulationStore();

    const results = useMemo(() => {
        return zones.map(zone => {
            const rainfallMM = (rainfallIncrease / 100) * 150;
            const effectiveDrainage = Math.max(0.05, zone.drain * (1 - (drainageEfficiency / 100)));

            const floodInputs = {
                rainfall_mm: rainfallMM,
                drainage_index: effectiveDrainage,
                elevation_index: zone.elevation,
                soil_absorption: zone.soil,
                historical_flood_factor: zone.floodFactor
            };

            const heatInputs = {
                temperature_c: 28 + tempIncrease, 
                humidity_percent: Math.min(100, zone.humidityBase + (rainfallIncrease * 0.1)),
                urban_heat_index: zone.heatIndex,
                population_density_index: zone.popDensity
            };

            let flood = calculateFloodRisk(floodInputs);
            let heat = calculateHeatRisk(heatInputs);

            if (mitigationActive) {
                flood = { ...flood, score: Math.max(0, flood.score * 0.7) };
                heat = { ...heat, score: Math.max(0, heat.score * 0.75) };
            }

            const baselineFlood = calculateFloodRisk({ ...floodInputs, rainfall_mm: 0 });
            const baselineHeat = calculateHeatRisk({ ...heatInputs, temperature_c: 28 });

            const interactionTerm = (rainfallMM * (28 + tempIncrease)) / 5000;
            const compoundRisk = (0.55 * flood.score) + (0.35 * heat.score) + (0.1 * interactionTerm);

            // Upgrade 12: Socioeconomic Risk Weighting
            let vulnerabilityFactor = 1.0;
            if (zone.popDensity > 0.8) vulnerabilityFactor += 0.2;
            if (zone.slumRatio > 0.2) vulnerabilityFactor += 0.15;
            const humanitarianImpact = Math.min(1.0, compoundRisk * vulnerabilityFactor);

            // Upgrade 10: Risk Velocity (Approximation)
            const riskVelocity = (flood.score - baselineFlood.score) / (rainfallIncrease || 1);

            const confidence = Math.max(0, 95 - (rainfallIncrease / 10) - (tempIncrease * 2));
            const uncertaintyBand = `±${(10 - confidence / 10).toFixed(1)}%`;

            const stressScore = humanitarianImpact;
            const stressLevel = stressScore > 0.8 ? 'CRITICAL' : stressScore > 0.6 ? 'HIGH' : stressScore > 0.3 ? 'MODERATE' : 'LOW';

            // Upgrade 11: Resource Allocation Optimization
            const efficiencyDrainage = (flood.score * 0.3) / 10;
            const efficiencyGreen = (heat.score * 0.2) / 5;
            const optimalAction = efficiencyDrainage > efficiencyGreen 
                ? "Infrastructure: Major Drainage Expansion (Efficiency: 1.5x)"
                : "Urban Reforestation & Green Roofs (Efficiency: 2.1x)";

            const intelligenceReport = generateIntelligenceReport(flood, heat, compoundRisk, riskVelocity * 10);

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
                projections,
                humanitarianImpact,
                infrastructureCollapseProb: flood.collapseProb || 0,
                riskVelocity,
                intelligenceReport,
                optimalAction,
                uncertaintyBand
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
