"use client";

import { useSimulationStore } from '@/store/useSimulationStore';

export default function MapLegend() {
    const { viewMode } = useSimulationStore();

    const floodLegend = [
        { label: "Critical", color: "bg-red-500" },
        { label: "High Risk", color: "bg-orange-500" },
        { label: "Baseline", color: "bg-blue-500" },
        { label: "Clear", color: "bg-blue-900/40" },
    ];

    const heatLegend = [
        { label: "Extreme", color: "bg-red-600" },
        { label: "High", color: "bg-orange-600" },
        { label: "Moderate", color: "bg-yellow-600" },
        { label: "Optimal", color: "bg-emerald-600/40" },
    ];

    const currentLegend = viewMode === 'flood' ? floodLegend : heatLegend;

    return (
        <div className="glass-panel p-3 w-40 border-white/5 bg-slate-950/40">
            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-1 flex justify-between">
                <span>Map Legend</span>
                <span className="text-blue-400">{viewMode.toUpperCase()}</span>
            </div>

            <div className="space-y-2">
                {currentLegend.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-sm border border-white/10 ${item.color}`} />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{item.label}</span>
                    </div>
                ))}
            </div>

            <div className="mt-3 pt-2 border-t border-white/5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full border border-blue-400 flex items-center justify-center animate-pulse">
                    <div className="w-0.5 h-0.5 bg-blue-400 rounded-full" />
                </div>
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Confidence Overlay</span>
            </div>
        </div>
    );
}
