"use client";

import { useRiskIntelligence } from '@/hooks/useRiskIntelligence';
import { useSimulationStore } from '@/store/useSimulationStore';
import { ShieldCheck, ArrowDownCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MitigationEffectivenessScore() {
    const { cityMetrics } = useRiskIntelligence();
    const { mitigationActive } = useSimulationStore();

    // Heuristic reduction calculation
    const reduction = mitigationActive ? 32 : 0;

    return (
        <div className="glass-panel p-4 w-64 border-white/5 bg-slate-900/40">
            <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Policy Efficacy</span>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <div className="text-[20px] font-black text-emerald-400">
                        {reduction}%
                    </div>
                    <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                        Risk Reduction Delta
                    </div>
                </div>

                <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                        <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-800" />
                        <motion.circle
                            cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4"
                            strokeDasharray="125.6"
                            initial={{ strokeDashoffset: 125.6 }}
                            animate={{ strokeDashoffset: 125.6 - (125.6 * reduction) / 100 }}
                            className="text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                        />
                    </svg>
                    <ArrowDownCircle className="absolute w-4 h-4 text-emerald-500/50" />
                </div>
            </div>

            <div className="mt-3 p-2 bg-emerald-500/5 rounded border border-emerald-500/10">
                <p className="text-[9px] text-emerald-400/80 font-bold leading-tight italic">
                    {mitigationActive
                        ? "Countermeasures actively suppressing regional climate volatility."
                        : "Policies on standby. Risk deltas following baseline trajectory."}
                </p>
            </div>
        </div>
    );
}
