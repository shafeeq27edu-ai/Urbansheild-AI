"use client";

import { useSimulationStore } from '@/store/useSimulationStore';
import { AlertTriangle, Settings2 } from 'lucide-react';

export default function RiskThresholdPanel() {
    const {
        floodThreshold,
        heatThreshold,
        setFloodThreshold,
        setHeatThreshold
    } = useSimulationStore();

    return (
        <div className="glass-panel p-4 w-64 border-white/5 bg-slate-900/40">
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                <Settings2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alert Thresholds</span>
            </div>

            <div className="space-y-6">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            Flood Inundation
                        </span>
                        <span className="text-[10px] font-black text-blue-400">{(floodThreshold * 100).toFixed(0)}%</span>
                    </div>
                    <input
                        type="range"
                        min="0.5"
                        max="0.95"
                        step="0.01"
                        value={floodThreshold}
                        onChange={(e) => setFloodThreshold(parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            Heatwave Severity
                        </span>
                        <span className="text-[10px] font-black text-orange-400">{(heatThreshold * 100).toFixed(0)}%</span>
                    </div>
                    <input
                        type="range"
                        min="0.5"
                        max="0.95"
                        step="0.01"
                        value={heatThreshold}
                        onChange={(e) => setHeatThreshold(parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-orange-500"
                    />
                </div>
            </div>

            <div className="mt-4 p-2 bg-blue-500/5 border border-blue-500/10 rounded">
                <p className="text-[8px] text-slate-400 leading-tight italic">
                    <AlertTriangle className="w-2.5 h-2.5 inline mr-1 text-blue-400/50" />
                    Adjusting thresholds recalibrates emergency mesh triggers dynamically.
                </p>
            </div>
        </div>
    );
}
