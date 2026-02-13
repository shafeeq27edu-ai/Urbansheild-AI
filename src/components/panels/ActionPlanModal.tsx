"use client";

import { CheckCircle2, FileText, Download, ShieldCheck, Users, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSimulationStore } from '@/store/useSimulationStore';
import { useRiskIntelligence } from '@/hooks/useRiskIntelligence';

export default function ActionPlanModal({ onClose }: { onClose: () => void }) {
    const { viewMode, rainfallIncrease, tempIncrease } = useSimulationStore();
    const { results, cityMetrics } = useRiskIntelligence();
    const cityAverageRisk = (cityMetrics.avgFlood + cityMetrics.avgHeat) / 2;

    const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-4 md:p-12"
        >
            <motion.div
                initial={{ y: 20, scale: 0.95 }}
                animate={{ y: 0, scale: 1 }}
                className="bg-white text-slate-900 w-full max-w-4xl max-h-full overflow-y-auto rounded-sm shadow-2xl flex flex-col font-serif"
            >
                {/* Document Header */}
                <div className="p-12 border-b-4 border-slate-900">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">UrbanShield Strategic Report</h1>
                            <p className="text-slate-500 uppercase tracking-[0.2em] text-xs font-bold font-sans">Climate Intelligence & Resilience Unit</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold uppercase font-sans">Status: <span className="text-red-600">Confidential</span></p>
                            <p className="text-xs font-bold uppercase font-sans">Date: {date}</p>
                            <p className="text-xs font-bold uppercase font-sans text-slate-400 mt-1">Ref: US-CT-{Math.floor(Math.random() * 10000)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8 py-8 border-y border-slate-200">
                        <div>
                            <p className="text-[10px] font-bold uppercase text-slate-400 font-sans mb-1">Risk Objective</p>
                            <p className="text-sm font-bold uppercase tracking-tight">{viewMode === 'flood' ? 'Flood Inundation Containment' : 'Extreme Heat Mitigation'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase text-slate-400 font-sans mb-1">City Resilience Index</p>
                            <p className="text-sm font-bold uppercase tracking-tight">{(100 - cityAverageRisk * 100).toFixed(1)}% Active</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase text-slate-400 font-sans mb-1">Target Scenario</p>
                            <p className="text-sm font-bold uppercase tracking-tight">+{viewMode === 'flood' ? rainfallIncrease + '%' : tempIncrease + '°C'} Intensity</p>
                        </div>
                    </div>
                </div>

                {/* Document Content */}
                <div className="p-12 space-y-12">
                    <section>
                        <h2 className="text-xl font-bold uppercase mb-4 border-l-4 border-slate-900 pl-4 font-sans">Executive Summary</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Current high-fidelity modeling indicates an elevated threat profile across the metropolitan grid.
                            Under the simulated {viewMode === 'flood' ? 'precipitation' : 'thermal'} surge,
                            city-wide risk averages <span className="font-bold">{(cityAverageRisk * 100).toFixed(1)}%</span>.
                            Structural vulnerabilities in specific sectors require immediate policy intervention to prevent systemic failure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase mb-6 border-l-4 border-slate-900 pl-4 font-sans">Sector Vulnerability Matrix</h2>
                        <div className="space-y-4">
                            {results.map(zone => {
                                const currentScore = viewMode === 'flood' ? zone.flood.score : zone.heat.score;
                                return (
                                    <div key={zone.id} className="flex justify-between items-center py-2 border-b border-slate-100 italic">
                                        <span className="font-bold">{zone.name}</span>
                                        <div className="flex gap-8">
                                            <span className="text-xs font-bold uppercase font-sans text-slate-400">Threat: <span className={currentScore > 0.7 ? 'text-red-500' : 'text-slate-900'}>{(currentScore * 100).toFixed(0)}%</span></span>
                                            <span className="text-xs font-bold uppercase font-sans text-slate-400 w-24 text-right">Confidence: High</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase mb-4 border-l-4 border-slate-900 pl-4 font-sans">Recommended Countermeasures</h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 bg-slate-50 border border-slate-200">
                                <h3 className="font-bold mb-2 uppercase text-xs font-sans tracking-widest text-blue-600">Immediate Action</h3>
                                <ul className="text-xs space-y-2 text-slate-600 font-sans">
                                    <li className="flex gap-2"><CheckCircle2 size={12} className="shrink-0 text-slate-400" /> Deploy mobile {viewMode === 'flood' ? 'water-gate' : 'cooling station'} units.</li>
                                    <li className="flex gap-2"><CheckCircle2 size={12} className="shrink-0 text-slate-400" /> Activate tier-1 civic response mesh.</li>
                                    <li className="flex gap-2"><CheckCircle2 size={12} className="shrink-0 text-slate-400" /> Load shedding for critical infrastructure.</li>
                                </ul>
                            </div>
                            <div className="p-6 bg-slate-50 border border-slate-200">
                                <h3 className="font-bold mb-2 uppercase text-xs font-sans tracking-widest text-emerald-600">Multi-Year Policy</h3>
                                <ul className="text-xs space-y-2 text-slate-600 font-sans">
                                    <li className="flex gap-2"><CheckCircle2 size={12} className="shrink-0 text-slate-400" /> {viewMode === 'flood' ? 'Subsurface sponge-city drainage' : 'Albedo-positive roofing mandates'} mandate.</li>
                                    <li className="flex gap-2"><CheckCircle2 size={12} className="shrink-0 text-slate-400" /> Distributed grid resilience upgrades.</li>
                                    <li className="flex gap-2"><CheckCircle2 size={12} className="shrink-0 text-slate-400" /> AI-driven real-time traffic redirection.</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer Controls */}
                <div className="mt-auto p-12 bg-slate-100 border-t border-slate-200 flex justify-between items-center font-sans">
                    <button
                        onClick={onClose}
                        className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        [ Esc ] Cancel Export
                    </button>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors">
                            <FileText className="w-3.5 h-3.5" /> View JSON Data
                        </button>
                        <button className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95">
                            <Download className="w-3.5 h-3.5" /> Download PDF Report
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
