"use client";

import { motion, Reorder } from 'framer-motion';
import { useRiskIntelligence } from '@/hooks/useRiskIntelligence';
import { ShieldAlert, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function ZoneRankingPanel() {
    const { cityMetrics } = useRiskIntelligence();
    const rankedZones = cityMetrics.rankedZones;

    return (
        <div className="glass-panel p-5 w-80 space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                Regional Risk Priority
            </h3>

            <div className="space-y-2">
                {rankedZones.map((zone, index) => {
                    const maxRisk = Math.max(zone.flood.score, zone.heat.score);
                    const severityLabel = maxRisk > 0.8 ? 'CRITICAL' : maxRisk > 0.6 ? 'HIGH' : maxRisk > 0.4 ? 'MODERATE' : 'OPTIMAL';
                    const severityColor = maxRisk > 0.8 ? 'text-red-500' : maxRisk > 0.6 ? 'text-orange-500' : maxRisk > 0.4 ? 'text-yellow-500' : 'text-emerald-500';

                    return (
                        <motion.div
                            key={zone.id}
                            layout
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-slate-900/40 border border-white/5 rounded-lg p-3 flex items-center justify-between group cursor-help"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-mono text-slate-600">#{index + 1}</span>
                                <div>
                                    <h4 className="text-[11px] font-bold text-slate-200">{zone.name}</h4>
                                    <p className={`text-[8px] font-black uppercase tracking-widest ${severityColor}`}>
                                        {severityLabel}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-black italic text-white">{(maxRisk * 10).toFixed(1)}</span>
                                    {maxRisk > 0.7 ? (
                                        <TrendingUp className="w-2.5 h-2.5 text-red-500" />
                                    ) : maxRisk < 0.3 ? (
                                        <TrendingDown className="w-2.5 h-2.5 text-emerald-500" />
                                    ) : (
                                        <Minus className="w-2.5 h-2.5 text-slate-500" />
                                    )}
                                </div>
                                <div className="flex gap-1 mt-1">
                                    <div className={`h-0.5 w-6 rounded-full ${zone.flood.score > 0.6 ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-slate-700'}`} />
                                    <div className={`h-0.5 w-6 rounded-full ${zone.heat.score > 0.6 ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'bg-slate-700'}`} />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="pt-2 border-t border-white/5">
                <p className="text-[8px] text-slate-500 italic text-center uppercase tracking-tighter">
                    Real-time ranking updated via Intelligence Pipeline
                </p>
            </div>
        </div>
    );
}
