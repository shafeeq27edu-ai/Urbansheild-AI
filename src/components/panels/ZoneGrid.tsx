"use client";

import { useRiskIntelligence } from '@/hooks/useRiskIntelligence';
import { useSimulationStore } from '@/store/useSimulationStore';
import { motion } from 'framer-motion';
import { Droplets, Thermometer, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

export default function ZoneGrid() {
    const { results } = useRiskIntelligence();
    const { viewMode, setFocusedZoneId, focusedZoneId } = useSimulationStore();

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full h-full">
            {results.map((zone) => {
                const risk = viewMode === 'flood' ? zone.flood : zone.heat;
                const isHighRisk = risk.score > 0.6;
                const isFocused = focusedZoneId === zone.id;

                const getRiskColor = (score: number) => {
                    if (score > 0.8) return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] border-red-400';
                    if (score > 0.6) return 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)] border-orange-400';
                    if (score > 0.3) return 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)] border-blue-400';
                    return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] border-emerald-400';
                };

                const barColor = viewMode === 'flood' ? 'bg-blue-500' : 'bg-orange-500';

                return (
                    <motion.button
                        key={zone.id}
                        layoutId={zone.id}
                        onClick={() => setFocusedZoneId(isFocused ? null : zone.id)}
                        className={`relative p-3 rounded-xl border flex flex-col justify-between transition-all group overflow-hidden ${isFocused
                            ? 'bg-slate-800/90 border-blue-400 scale-[1.02] z-10 shadow-[0_0_30px_rgba(59,130,246,0.2)]'
                            : 'glass-card hover:bg-slate-800/60 hover:border-white/20 hover-lift'
                            }`}
                        whileHover={{ y: -2 }}
                    >
                        {/* Dynamic Background Glow for High Risk */}
                        {isHighRisk && (
                            <div className={`absolute inset-0 opacity-20 ${viewMode === 'flood' ? 'bg-blue-600' : 'bg-orange-600'} animate-pulse mix-blend-overlay`} />
                        )}

                        {/* Subtle Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

                        <div className="flex justify-between items-start w-full relative z-10">
                            <div>
                                <h4 className="text-[10px] font-black text-slate-100 uppercase tracking-widest text-left drop-shadow-md">{zone.name}</h4>
                                <div className="flex items-center gap-1.5 mt-1.5">
                                    <div className={`w-1.5 h-1.5 rounded-full ${getRiskColor(risk.score)} ring-1 ring-white/10`} />
                                    <span className={`text-[9px] font-bold tracking-wider ${isHighRisk ? 'text-white' : 'text-slate-400'}`}>
                                        {risk.category.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            {isHighRisk ? (
                                <AlertTriangle className="w-4 h-4 text-orange-400 animate-bounce drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]" />
                            ) : (
                                <Activity className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                            )}
                        </div>

                        <div className="w-full mt-4 space-y-1 relative z-10">
                            <div className="flex justify-between text-[9px] font-mono text-slate-400 font-bold">
                                <span>RISK INDEX</span>
                                <span className={isHighRisk ? 'text-orange-400' : 'text-emerald-400'}>{(risk.score * 100).toFixed(0)}%</span>
                            </div>
                            <div className="h-1 w-full bg-slate-950/50 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${risk.score * 100}%` }}
                                    transition={{ type: 'spring', bounce: 0, duration: 1 }}
                                    className={`h-full ${barColor}`}
                                />
                            </div>
                        </div>

                        {/* Interactive "Click to Focus" Hint overlay on hover */}
                        <div className={`absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20`}>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white border border-white/20 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg">
                                {isFocused ? 'DEFOCUS' : 'INSPECT ZONE'}
                            </span>
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
}
