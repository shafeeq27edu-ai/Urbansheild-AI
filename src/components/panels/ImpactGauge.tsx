"use client";

import { motion } from 'framer-motion';
import { useRiskIntelligence } from '@/hooks/useRiskIntelligence';

export default function ImpactGauge() {
    const { cityMetrics } = useRiskIntelligence();

    const gauges = [
        { label: "Infrastructure Strain", value: Math.round(cityMetrics.avgStress * 100), color: "text-blue-400" },
        { label: "Population Exposure", value: Math.round((cityMetrics.avgFlood * 0.7 + cityMetrics.avgHeat * 0.3) * 85), color: "text-orange-400" },
        { label: "Emergency Readiness", value: Math.round(cityMetrics.resilienceScore), color: "text-emerald-400" },
    ];

    return (
        <div className="glass-panel p-4 w-64 border-white/5 bg-slate-900/40">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">
                Predictive Impact Gauges
            </div>

            <div className="space-y-6">
                {gauges.map((g, i) => (
                    <div key={i}>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">{g.label}</span>
                            <span className={`text-[10px] font-black ${g.color}`}>{g.value}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden relative">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${g.value}%` }}
                                className={`h-full rounded-full transition-all duration-1000 ${g.color.replace('text', 'bg')}`}
                            />
                            {/* Subtle ticks */}
                            <div className="absolute inset-0 flex justify-between px-1 pointer-events-none opacity-20">
                                <div className="w-0.5 h-full bg-white/40" />
                                <div className="w-0.5 h-full bg-white/40" />
                                <div className="w-0.5 h-full bg-white/40" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
