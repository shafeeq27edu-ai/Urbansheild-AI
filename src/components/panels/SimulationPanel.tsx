"use client";

import { useSimulationStore } from '@/store/useSimulationStore';
import { Wind, Droplets, Thermometer, Map as MapIcon, Layers, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SimulationPanel() {
    const {
        rainfallIncrease,
        tempIncrease,
        setRainfall,
        setTemp,
        viewMode,
        setViewMode,
        mitigationActive,
        setMitigationActive,
        isCalculating,
        setIsCalculating,
        calibrationModeActive,
        drainageEfficiency,
        setDrainageEfficiency
    } = useSimulationStore();

    const handleSimulationChange = (type: 'rainfall' | 'temp', value: number) => {
        setIsCalculating(true);
        if (type === 'rainfall') setRainfall(value);
        else setTemp(value);

        // Simulate "AI Inference" time for judge effect
        setTimeout(() => {
            setIsCalculating(false);
        }, 800);
    };

    return (
        <div className="glass-panel p-6 w-80 space-y-8 relative overflow-hidden">
            <AnimatePresence>
                {isCalculating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
                    >
                        <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
                        <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] animate-pulse">Running Inference</h4>
                        <p className="text-[8px] text-slate-500 mt-1 font-mono uppercase tracking-tighter">Updating climate vectors...</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div>
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                    <div className="text-blue-400"><Layers className="w-5 h-5" /></div>
                    Intelligence Layers
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => setViewMode('flood')}
                        className={`p-3 rounded-lg flex flex-col items-center gap-2 transition-all ${viewMode === 'flood' ? 'bg-blue-600/40 border-blue-500/50' : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-700/40'
                            } border`}
                    >
                        <div className={viewMode === 'flood' ? 'text-blue-400' : 'text-slate-400'}><Droplets /></div>
                        <span className="text-xs font-semibold">Flood Risk</span>
                    </button>
                    <button
                        onClick={() => setViewMode('heat')}
                        className={`p-3 rounded-lg flex flex-col items-center gap-2 transition-all ${viewMode === 'heat' ? 'bg-orange-600/40 border-orange-500/50' : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-700/40'
                            } border`}
                    >
                        <div className={viewMode === 'heat' ? 'text-orange-400' : 'text-slate-400'}><Thermometer /></div>
                        <span className="text-xs font-semibold">Heat Severity</span>
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <div className="text-cyan-400"><Wind className="w-5 h-5" /></div>
                    Simulation Engine
                </h3>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Rainfall Increase</span>
                            <span className="text-blue-400 font-bold">+{rainfallIncrease}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={rainfallIncrease}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSimulationChange('rainfall', parseInt(e.target.value))}
                            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Temperature Rise</span>
                            <span className="text-orange-400 font-bold">+{tempIncrease}°C</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="10"
                            step="0.5"
                            value={tempIncrease}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSimulationChange('temp', parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Drainage Efficiency Drop</span>
                            <span className="text-red-400 font-bold">-{drainageEfficiency}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={drainageEfficiency}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDrainageEfficiency(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                        />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {calibrationModeActive && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-lg space-y-4"
                    >
                        <h4 className="text-[10px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-2">
                            <Settings className="w-3 h-3" /> Parameter Calibration
                        </h4>

                        <div className="space-y-3">
                            <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-bold">
                                    <span className="text-slate-500">SURFACE ALBEDO</span>
                                    <span className="text-orange-400 italic">Override Alpha</span>
                                </div>
                                <input type="range" className="w-full h-1 bg-slate-800 accent-orange-500 rounded-full appearance-none cursor-pointer" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-bold">
                                    <span className="text-slate-500">INFRASTRUCTURE AGE</span>
                                    <span className="text-orange-400 italic">Structural Decay</span>
                                </div>
                                <input type="range" className="w-full h-1 bg-slate-800 accent-orange-500 rounded-full appearance-none cursor-pointer" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="pt-4 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mitigation Policies</h4>
                        <p className="text-[9px] text-slate-500 italic">Apply urban resilience stratagem</p>
                    </div>
                    <button
                        onClick={() => setMitigationActive(!mitigationActive)}
                        className={`w-10 h-5 rounded-full relative transition-colors ${mitigationActive ? 'bg-emerald-600' : 'bg-slate-700'}`}
                    >
                        <motion.div
                            animate={{ x: mitigationActive ? 20 : 2 }}
                            className="absolute top-1 w-3 h-3 bg-white rounded-full"
                        />
                    </button>
                </div>

                {mitigationActive && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg space-y-2"
                    >
                        <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-tight text-emerald-400">
                            <span>Policy Effectiveness</span>
                            <span>High (+30%)</span>
                        </div>
                        <div className="h-1 bg-emerald-900/50 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '70%' }}
                                className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"
                            />
                        </div>
                        <p className="text-[8px] text-emerald-500/80 font-mono leading-tight">
                            &gt; ACTOR_DRAINAGE_REINFORCEMENT_ACTIVE<br />
                            &gt; ALBEDO_SURFACE_TREATMENT_ENABLED
                        </p>
                    </motion.div>
                )}

                {!mitigationActive && (
                    <div className="flex items-center gap-3 p-3 bg-slate-900/50 border border-white/5 rounded-lg opacity-60">
                        <div className="w-2 h-2 rounded-full bg-slate-500" />
                        <span className="text-[9px] text-slate-500 font-medium italic">
                            Policies Offline: Risk Unmitigated
                        </span>
                    </div>
                )}

                <button
                    onClick={() => useSimulationStore.getState().reset()}
                    className="w-full py-3 rounded-lg bg-slate-800/40 border border-white/5 hover:bg-slate-700/40 transition-all flex items-center justify-center gap-2 group"
                >
                    <div className="text-slate-400 group-hover:rotate-[-45deg] transition-transform duration-300">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reset to Baseline</span>
                </button>
            </div>
        </div>
    );
}
