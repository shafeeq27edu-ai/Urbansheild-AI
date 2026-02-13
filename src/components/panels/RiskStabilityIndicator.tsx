"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useRiskIntelligence } from '@/hooks/useRiskIntelligence';
import { AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function RiskStabilityIndicator() {
    const { cityMetrics } = useRiskIntelligence();
    const volatility = (cityMetrics.avgFlood + cityMetrics.avgHeat) / 2;
    const isVolatile = volatility > 0.6;

    return (
        <div className="glass-panel p-3 w-40 border-white/5 bg-slate-900/40">
            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Pattern Stability</div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {isVolatile ? (
                        <TrendingUp className="w-3 h-3 text-red-500 animate-bounce" />
                    ) : (
                        <Minus className="w-3 h-3 text-emerald-500" />
                    )}
                    <span className={`text-xs font-black uppercase tracking-tighter ${isVolatile ? 'text-red-400' : 'text-emerald-400'}`}>
                        {isVolatile ? 'Volatile' : 'Stable'}
                    </span>
                </div>

                <div className="flex gap-0.5">
                    {[1, 2, 3].map(i => (
                        <motion.div
                            key={i}
                            animate={{ opacity: isVolatile ? [0.2, 1, 0.2] : 0.4 }}
                            transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
                            className={`w-1 h-3 rounded-full ${isVolatile ? 'bg-red-500' : 'bg-emerald-500'}`}
                        />
                    ))}
                </div>
            </div>

            <div className="mt-2 text-[8px] text-slate-500 font-bold uppercase leading-none">
                {isVolatile ? 'Rapid Pattern Shift Detected' : 'No Significant Delta Fluctuations'}
            </div>
        </div>
    );
}
