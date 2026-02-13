"use client";

import { motion } from 'framer-motion';
import { useRiskIntelligence } from '@/hooks/useRiskIntelligence';
import { useSimulationStore } from '@/store/useSimulationStore';

export default function RiskProjectionChart() {
    const { results } = useRiskIntelligence();
    const { viewMode } = useSimulationStore();

    // Aggregate projections for the whole city
    const aggregatedProjections = Array.from({ length: 6 }, (_, i) => {
        const hour = i + 1;
        const avgFlood = results.reduce((acc, z) => acc + z.projections[i].flood, 0) / results.length;
        const avgHeat = results.reduce((acc, z) => acc + z.projections[i].heat, 0) / results.length;
        return { hour, score: viewMode === 'flood' ? avgFlood : avgHeat };
    });

    const color = viewMode === 'flood' ? 'bg-blue-500' : 'bg-orange-500';

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
                <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">6H Predictive Vector</h4>
                <span className="text-[8px] font-mono text-slate-600">t +6h</span>
            </div>
            <div className="flex items-end justify-between h-16 gap-1 px-2">
                {aggregatedProjections.map((p, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                        <div className="relative w-full flex items-end justify-center h-full">
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${p.score * 100}%` }}
                                className={`w-full rounded-t-sm ${color} opacity-40 group-hover:opacity-100 transition-opacity`}
                                style={{ boxShadow: `0 0 10px ${viewMode === 'flood' ? '#3b82f644' : '#f9731644'}` }}
                            />
                        </div>
                        <span className="text-[7px] font-bold text-slate-600">+{p.hour}h</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
