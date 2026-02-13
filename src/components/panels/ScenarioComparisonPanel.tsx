"use client";

import { motion } from 'framer-motion';
import { useRiskIntelligence } from '@/hooks/useRiskIntelligence';
import { useSimulationStore } from '@/store/useSimulationStore';
import { Activity, ShieldOff, Target } from 'lucide-react';

export default function ScenarioComparisonPanel() {
    const { results } = useRiskIntelligence();
    const { viewMode } = useSimulationStore();

    // Choose the first zone as example for comparison
    const zone = results[0];
    const currentScore = viewMode === 'flood' ? zone.flood.score : zone.heat.score;
    const baselineScore = viewMode === 'flood' ? zone.baselineFlood.score : zone.baselineHeat.score;

    const diff = currentScore - baselineScore;
    const isWorse = diff > 0;

    return (
        <div className="glass-panel p-5 w-80 space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                Scenario Delta Analysis
            </h3>

            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Baseline State</span>
                        <div className="text-lg font-black text-slate-300">{(baselineScore * 10).toFixed(1)}</div>
                    </div>
                    <div className="h-8 w-px bg-white/10 mb-1" />
                    <div className="space-y-1 text-right">
                        <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Active Scenario</span>
                        <div className={`text-lg font-black ${isWorse ? 'text-red-500' : 'text-emerald-400'}`}>
                            {(currentScore * 10).toFixed(1)}
                        </div>
                    </div>
                </div>

                <div className="relative h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${baselineScore * 100}%` }}
                        className="absolute left-0 top-0 h-full bg-slate-600 opacity-30"
                    />
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${currentScore * 100}%` }}
                        className={`absolute left-0 top-0 h-full ${isWorse ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-emerald-400'}`}
                    />
                </div>

                <div className={`p-3 rounded-lg border flex items-center gap-3 transition-colors ${isWorse ? 'bg-red-900/10 border-red-500/20' : 'bg-emerald-900/10 border-emerald-500/20'
                    }`}>
                    <div className={`p-1.5 rounded-md ${isWorse ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {isWorse ? <ShieldOff size={14} /> : <Activity size={14} />}
                    </div>
                    <div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Net Variance</div>
                        <div className={`text-xs font-black ${isWorse ? 'text-red-400' : 'text-emerald-400'}`}>
                            {isWorse ? '+' : ''}{(diff * 100).toFixed(1)}% Risk Shift
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-[8px] text-slate-500 font-mono text-center uppercase">
                &gt; VULNERABILITY_GAP_DETECTED: {Math.abs(diff * 100).toFixed(1)}%
            </p>
        </div>
    );
}
