"use client";

import React, { memo, useState, useCallback, useMemo } from 'react';
import { Brain, Info, ShieldCheck, ChevronDown, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulationStore } from '@/store/useSimulationStore';
import { useRiskIntelligence } from '@/hooks/useRiskIntelligence';
import { getFloodRiskStyle, getHeatRiskStyle } from '@/lib/styles';
import ConfidenceRing from '../ui/ConfidenceRing';
import RiskProjectionChart from '../ui/RiskProjectionChart';

const LOG_ENTRIES_TEMPLATE = [
    "[SYSTEM]: Initializing heuristic alignment...",
    "[INFERENCE]: Vectorizing metadata layer",
    "[ANALYSIS]: Multi-layer gradient descent applied",
    "[STRATEGY]: Optimized counters calculated",
    "[STATUS]: Projection confidence verified"
];

function AIExplanationPanel() {
    const { viewMode } = useSimulationStore();
    const { topRiskZone } = useRiskIntelligence();
    const [showLogs, setShowLogs] = useState(false);

    const currentRisk = useMemo(() =>
        viewMode === 'flood' ? topRiskZone.flood : topRiskZone.heat
        , [viewMode, topRiskZone]);

    const styles = useMemo(() =>
        viewMode === 'flood' ? getFloodRiskStyle(currentRisk.score) : getHeatRiskStyle(currentRisk.score)
        , [viewMode, currentRisk.score]);

    const isHighRisk = currentRisk.score > 0.6;

    const toggleLogs = useCallback(() => setShowLogs(prev => !prev), []);

    const logEntries = useMemo(() => [
        LOG_ENTRIES_TEMPLATE[0],
        `[INFERENCE]: Vectorizing ${topRiskZone.name} metadata`,
        ...LOG_ENTRIES_TEMPLATE.slice(2)
    ], [topRiskZone.name]);

    return (
        <div className={`glass-panel p-6 w-96 max-h-[85vh] flex flex-col overflow-hidden transition-all duration-500 border border-white/5 ${styles.glow}`}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${styles.bg}`}>
                        <Brain className={`${styles.color} w-6 h-6`} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black italic tracking-tighter">AI INSIGHTS</h2>
                        <p className={`text-[10px] ${styles.color} tracking-widest uppercase font-black`}>Inference Engine v2.1</p>
                    </div>
                </div>
                <ConfidenceRing value={topRiskZone.confidence} />
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${viewMode}-${topRiskZone.id}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="space-y-4"
                    >
                        <div className={`p-4 rounded-xl border transition-all duration-500 ${styles.bg} ${styles.border}`}>
                            <h3 className="font-black flex items-center gap-2 mb-2 text-slate-100 italic tracking-tight">
                                <Info className={`w-4 h-4 ${styles.color}`} />
                                {topRiskZone.name.toUpperCase()} RATIONALE
                            </h3>
                            <p className="text-[11px] text-slate-400 leading-relaxed uppercase tracking-wide font-bold">
                                {currentRisk.explanation}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pb-2">
                            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                                <div className="text-[8px] text-slate-500 font-bold uppercase">Impact Delta</div>
                                <div className={`text-lg font-black ${currentRisk.delta && currentRisk.delta > 0 ? 'text-orange-400' : 'text-emerald-400'}`}>
                                    {currentRisk.delta ? (currentRisk.delta * 100).toFixed(1) : '0.0'}%
                                </div>
                            </div>
                            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                                <div className="text-[8px] text-slate-500 font-bold uppercase">Uncertainty</div>
                                <div className="text-lg font-black text-blue-400">±{(currentRisk.uncertainty * 10).toFixed(1)}%</div>
                            </div>
                        </div>

                        {/* Explainable AI: Feature Contribution */}
                        <div className="space-y-3 p-4 bg-slate-900/50 rounded-xl border border-white/5">
                            <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Inference Determinants (SHAP)</h4>
                            <div className="space-y-2">
                                {viewMode === 'flood' ? (
                                    <>
                                        <FactorBar label="Precipitation Intensity" weight={mapRange(topRiskZone.flood.score, 0, 1, 40, 90)} color="bg-blue-500" />
                                        <FactorBar label="Drainage Capacity Load" weight={mapRange((1 - topRiskZone.drain), 0, 1, 20, 80)} color="bg-orange-500" />
                                        <FactorBar label="Soil Saturation" weight={topRiskZone.soil * 100} color="bg-emerald-500" />
                                        <FactorBar label="Elevation Vulnerability" weight={(1 - topRiskZone.elevation) * 100} color="bg-slate-500" />
                                    </>
                                ) : (
                                    <>
                                        <FactorBar label="Thermal Radiation" weight={mapRange(topRiskZone.heat.score, 0, 1, 50, 95)} color="bg-red-500" />
                                        <FactorBar label="Humidity Amplification" weight={topRiskZone.humidityBase} color="bg-blue-400" />
                                        <FactorBar label="Urban Heat Island" weight={topRiskZone.heatIndex * 100} color="bg-orange-500" />
                                        <FactorBar label="Pop. Density Risk" weight={topRiskZone.popDensity * 100} color="bg-purple-500" />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* 6-Hour Projections */}
                        <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5">
                            <RiskProjectionChart />
                        </div>

                        <div className={`p-4 rounded-xl border transition-all duration-500 ${styles.bg} ${styles.border}`}>
                            <h3 className={`font-black flex items-center gap-2 mb-2 ${styles.color} italic tracking-tight`}>
                                <ShieldCheck className="w-4 h-4" />
                                ADAPTIVE COUNTERMEASURES
                            </h3>
                            <ul className="text-[11px] text-slate-300 space-y-2 list-disc pl-4 font-bold uppercase tracking-tight">
                                {viewMode === 'flood' ? (
                                    <>
                                        <li>Activate Zone-{topRiskZone.id} drainage bypass valves.</li>
                                        <li>Deploy rapid-response flood barriers to low sectors.</li>
                                        <li>Trigger hyper-local citizen safety broadcasts.</li>
                                    </>
                                ) : (
                                    <>
                                        <li>Deploy adaptive cooling misting in Sector {topRiskZone.id}.</li>
                                        <li>Activate emergency urban canopy shaders.</li>
                                        <li>Initiate power grid load balancing for cooling peaks.</li>
                                    </>
                                )}
                            </ul>
                        </div>

                        {/* Reasoning Log Trigger */}
                        <div className="pt-2">
                            <button
                                onClick={toggleLogs}
                                className="w-full flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <List className="w-3 h-3" />
                                    Analysis Reasoning Log
                                </span>
                                <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${showLogs ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {showLogs && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden mt-2 p-3 bg-slate-950/50 rounded-lg border border-white/5 font-mono"
                                    >
                                        {logEntries.map((log, i) => (
                                            <div key={i} className="text-[8px] text-slate-500 whitespace-nowrap mb-1">
                                                <span className="text-blue-500/50 opacity-50 mr-2">
                                                    [{(new Date().getSeconds() + i * 2) % 60}s]
                                                </span>
                                                {log}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] text-slate-500">
                <span className="flex items-center gap-1 font-mono">
                    <div className={`w-1.5 h-1.5 rounded-full ${isHighRisk ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`} />
                    STATUS: {isHighRisk ? 'CRITICAL' : 'OPTIMAL'}
                </span>
                <div className="flex items-end gap-0.5 h-4 px-2">
                    {[3, 5, 4, 7, 6, 8, 5, 9, 7].map((h, i) => (
                        <div key={i} className={`w-1 bg-blue-500 opacity-40 rounded-t-sm`} style={{ height: `${h * 10}%` }} />
                    ))}
                </div>
                <span className="font-mono">ID: {viewMode.toUpperCase()}-{topRiskZone.id}-X</span>
            </div>
        </div>
    );
}

export default memo(AIExplanationPanel);

const FactorBar = memo(function FactorBar({ label, weight, color }: { label: string, weight: number, color: string }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-[8px] font-bold uppercase tracking-tighter">
                <span className="text-slate-400">{label}</span>
                <span className="text-slate-200">{weight.toFixed(0)}% contribution</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${weight}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full ${color}`}
                />
            </div>
        </div>
    );
});

function mapRange(val: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return ((val - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
