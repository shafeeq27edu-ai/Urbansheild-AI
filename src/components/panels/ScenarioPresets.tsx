"use client";

import { useSimulationStore } from '@/store/useSimulationStore';
import { CloudRain, Sun, Zap, Info, Wind } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ScenarioPresets() {
    const { setRainfall, setTemp, setMitigationActive } = useSimulationStore();

    const presets = [
        {
            label: "Baseline",
            icon: <Info className="w-3.5 h-3.5" />,
            vals: { rain: 0, temp: 0, mit: false },
            color: "border-slate-800 hover:border-slate-400 text-slate-400"
        },
        {
            label: "Flood Surge",
            icon: <CloudRain className="w-3.5 h-3.5" />,
            vals: { rain: 150, temp: 2, mit: false },
            color: "border-blue-900/50 hover:border-blue-400 text-blue-400"
        },
        {
            label: "Heat Dome",
            icon: <Sun className="w-3.5 h-3.5" />,
            vals: { rain: 0, temp: 35, mit: false },
            color: "border-orange-900/50 hover:border-orange-400 text-orange-400"
        },
        {
            label: "Total Failure",
            icon: <Zap className="w-3.5 h-3.5" />,
            vals: { rain: 180, temp: 40, mit: false },
            color: "border-red-900/50 hover:border-red-400 text-red-400"
        },
    ];

    const applyPreset = (vals: { rain: number, temp: number, mit: boolean }) => {
        setRainfall(vals.rain);
        setTemp(vals.temp);
        setMitigationActive(vals.mit);
    };

    return (
        <div className="glass-panel p-4 w-64 border-white/5 bg-slate-900/40">
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scenario Presets</span>
                <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-blue-500" />
                    <div className="w-1 h-1 rounded-full bg-blue-500/50" />
                    <div className="w-1 h-1 rounded-full bg-blue-500/20" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {presets.map((p, idx) => (
                    <motion.button
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => applyPreset(p.vals)}
                        className={`p-3 rounded border bg-white/5 flex flex-col items-center gap-2 transition-all group ${p.color}`}
                    >
                        {p.icon}
                        <span className="text-[9px] font-black uppercase tracking-widest text-center">{p.label}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
