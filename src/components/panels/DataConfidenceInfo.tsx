"use client";

import { Info, Database, Satellite, Zap } from 'lucide-react';

export default function DataConfidenceInfo() {
    return (
        <div className="glass-panel p-5 w-80 border-white/5 bg-slate-900/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <Database className="w-24 h-24" />
            </div>

            <div className="flex items-center gap-2 mb-4">
                <Info className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-black tracking-widest text-white uppercase">Data Transparency</h3>
            </div>

            <div className="space-y-4 relative z-10">
                <div className="flex gap-3">
                    <div className="p-2 bg-blue-500/10 rounded border border-blue-500/20 h-fit">
                        <Zap className="w-3 h-3 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-300 uppercase leading-tight mb-1">Synthetic Calibration</p>
                        <p className="text-[9px] text-slate-500 leading-relaxed italic">
                            This simulation uses hyper-local heuristic engines calibrated against historical climate delta patterns.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded border border-emerald-500/20 h-fit">
                        <Satellite className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-300 uppercase leading-tight mb-1">Industrial Scalability</p>
                        <p className="text-[9px] text-slate-500 leading-relaxed italic">
                            Architecture is designed for multi-sensor IoT ingestion and satellite SAR (Synthetic Aperture Radar) data fusion.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-[0.2em] text-slate-600">
                    <span>Build: v1.0.42-stable</span>
                    <span>Ready for Deployment</span>
                </div>
            </div>
        </div>
    );
}
