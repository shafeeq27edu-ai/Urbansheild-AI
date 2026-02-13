"use client";

import { motion } from 'framer-motion';
import { useRiskIntelligence } from '@/hooks/useRiskIntelligence';
import { Radar } from 'lucide-react';

export default function RiskRadarChart() {
    const { cityMetrics } = useRiskIntelligence();

    // Heuristic points for radar
    const points = [
        { label: "FLOOD", val: cityMetrics.avgFlood },
        { label: "HEAT", val: cityMetrics.avgHeat },
        { label: "STRESS", val: cityMetrics.avgStress },
        { label: "VULN", val: 1 - cityMetrics.resilienceScore / 100 },
        { label: "ECON", val: Math.min(1, cityMetrics.economicLoss / 100) },
    ];

    const radius = 60;
    const center = 80;

    const getPoint = (val: number, index: number, total: number) => {
        const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
        return {
            x: center + radius * val * Math.cos(angle),
            y: center + radius * val * Math.sin(angle),
        };
    };

    const polygonPoints = points
        .map((p, i) => {
            const pt = getPoint(p.val, i, points.length);
            return `${pt.x},${pt.y}`;
        })
        .join(" ");

    return (
        <div className="glass-panel p-4 w-64 border-white/5 bg-slate-900/40">
            <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-2">
                <Radar className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vector Comparison</span>
            </div>

            <div className="relative w-full aspect-square flex items-center justify-center">
                <svg width="160" height="160" className="overflow-visible">
                    {/* Background circles */}
                    {[0.2, 0.4, 0.6, 0.8, 1].map(r => (
                        <circle key={r} cx={center} cy={center} r={radius * r} fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-800" />
                    ))}

                    {/* Axes */}
                    {points.map((_, i) => {
                        const pt = getPoint(1, i, points.length);
                        return <line key={i} x1={center} y1={center} x2={pt.x} y2={pt.y} stroke="currentColor" strokeWidth="0.5" className="text-slate-800" />;
                    })}

                    {/* Data Polygon */}
                    <motion.polygon
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        points={polygonPoints}
                        fill="rgba(59, 130, 246, 0.3)"
                        stroke="rgba(59, 130, 246, 0.8)"
                        strokeWidth="1.5"
                        className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                    />

                    {/* Labels */}
                    {points.map((p, i) => {
                        const pt = getPoint(1.2, i, points.length);
                        return (
                            <text
                                key={i}
                                x={pt.x}
                                y={pt.y}
                                fill="currentColor"
                                fontSize="7"
                                fontWeight="black"
                                textAnchor="middle"
                                className="text-slate-500 uppercase tracking-tighter"
                            >
                                {p.label}
                            </text>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
