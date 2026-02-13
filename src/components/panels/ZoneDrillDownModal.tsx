"use client";

import { motion } from 'framer-motion';
import { useSimulationStore } from '@/store/useSimulationStore';
import { useRiskIntelligence } from '@/hooks/useRiskIntelligence';
import { X, Shield, Activity, MapPin, Info } from 'lucide-react';
import ConfidenceRing from '../ui/ConfidenceRing';

export default function ZoneDrillDownModal() {
    const { focusedZoneId, setFocusedZoneId, viewMode } = useSimulationStore();
    const { results } = useRiskIntelligence();

    const zone = results.find(z => z.id === focusedZoneId);

    if (!zone) return null;

    const currentRisk = viewMode === 'flood' ? zone.flood : zone.heat;
    const color = viewMode === 'flood' ? 'text-blue-400' : 'text-orange-400';
    const bgColor = viewMode === 'flood' ? 'bg-blue-500/10' : 'bg-orange-500/10';
    const borderColor = viewMode === 'flood' ? 'border-blue-500/30' : 'border-orange-500/30';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none p-6"
        >
            <div className="glass-panel w-full max-w-xl pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className={`p-6 border-b border-white/10 flex items-center justify-between ${bgColor}`}>
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${bgColor} ${borderColor} border`}>
                            <MapPin className={color} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black italic tracking-tighter">{zone.name.toUpperCase()}</h2>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Sector Drill-Down Analytics</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setFocusedZoneId(null)}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                    >
                        <X className="text-slate-500" />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar">
                    {/* Top Row Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <DrillStat label="Risk Score" value={(currentRisk.score * 10).toFixed(1)} color={color} />
                        <DrillStat label="Infrastructure Stress" value={zone.stressLevel} color={zone.stressLevel === 'CRITICAL' ? 'text-red-500' : 'text-yellow-500'} />
                        <div className="flex flex-col items-center justify-center">
                            <ConfidenceRing value={zone.confidence} size={48} />
                            <span className="text-[8px] text-slate-500 font-bold uppercase mt-2">Confidence</span>
                        </div>
                    </div>

                    {/* Sensor Data Feed */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Activity size={14} className="text-emerald-400" />
                            Live Telemetry Stream
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <SensorNode label="Elevation" value={`${(zone.elevation * 100).toFixed(0)}m`} />
                            <SensorNode label="Albedo Index" value={zone.albedo.toFixed(2)} />
                            <SensorNode label="Pop. Density" value={`${(zone.popDensity * 100).toFixed(0)}%`} />
                            <SensorNode label="Drainage Cap." value={`${(zone.drain * 100).toFixed(0)}%`} />
                        </div>
                    </div>

                    {/* AI Assessment */}
                    <div className="space-y-3 p-5 bg-white/5 border border-white/10 rounded-2xl">
                        <div className="flex items-center gap-2 text-cyan-400 mb-2">
                            <Shield size={16} />
                            <span className="text-xs font-black uppercase tracking-widest">Digital Twin Assessment</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed font-medium">
                            Sector {zone.id} shows heightened vulnerability due to {viewMode === 'flood' ? 'low elevation gradients' : 'high urban heat island effect'}.
                            Immediate {viewMode === 'flood' ? 'drainage bypass' : 'grid load balancing'} is recommended to maintain sector stability.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-950/50 border-t border-white/10 text-center">
                    <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">
                        UUID: {Math.random().toString(16).slice(2, 10)}-{zone.id}-7721 | CALIBRATED_INFERENCE_ACTIVE
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

function DrillStat({ label, value, color }: { label: string, value: string, color: string }) {
    return (
        <div className="text-center">
            <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">{label}</div>
            <div className={`text-xl font-black ${color}`}>{value}</div>
        </div>
    );
}

function SensorNode({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
            <span className="text-[10px] text-slate-500 font-bold uppercase">{label}</span>
            <span className="text-xs font-black text-slate-200">{value}</span>
        </div>
    );
}
