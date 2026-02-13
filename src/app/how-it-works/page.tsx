"use client";

import { motion } from 'framer-motion';
import { Shield, Brain, Globe, Database, Network, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorks() {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
            {/* Background Grid */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
                <div className="h-full w-full bg-[size:50px_50px] bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />
            </div>

            <nav className="relative z-10 px-8 py-6 flex justify-between items-center bg-slate-950/50 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-black tracking-tighter">
                        URBAN<span className="text-blue-500">SHIELD</span> <span className="text-slate-500 font-light tracking-widest text-xs uppercase ml-2">Technical Core</span>
                    </h1>
                </div>
                <Link
                    href="/"
                    className="flex items-center gap-2 px-4 py-2 glass-panel border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest transition-all"
                >
                    <ArrowLeft className="w-3 h-3" /> Return to Twin
                </Link>
            </nav>

            <main className="relative z-10 max-w-5xl mx-auto px-8 py-20 pb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                    <section className="space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-5xl font-black tracking-tighter italic text-blue-500">THE INTELLIGENCE ENGINE</h2>
                            <p className="text-slate-400 text-lg font-bold leading-relaxed">
                                Beyond simple data visualization, UrbanShield AI implements a deterministic inference pipeline that predicts urban vulnerability at hyper-local scales.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {[
                                {
                                    title: "Heuristic Risk Matrix",
                                    desc: "Our model calculates risk by correlating environmental deltas (Precipitation, Temperature) with structural vulnerability nodes (Elevation, Infrastructure Age, Pop Density).",
                                    icon: <Brain className="text-blue-400" />
                                },
                                {
                                    title: "Digital Twin Synchronization",
                                    desc: "Real-time state management via Zustand ensures that map layers and analytical panels update synchronously in <16ms.",
                                    icon: <Network className="text-emerald-400" />
                                },
                                {
                                    title: "SAR Data Simulation",
                                    desc: "Future-proofed for Synthetic Aperture Radar fusion, allowing for sub-centimeter flood detection and building-level thermal monitoring.",
                                    icon: <Globe className="text-orange-400" />
                                },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex gap-6 p-6 glass-panel border-white/5 bg-slate-900/20"
                                >
                                    <div className="p-3 bg-white/5 rounded-xl h-fit">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black tracking-tight mb-2 uppercase">{item.title}</h3>
                                        <p className="text-slate-500 font-bold text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-12">
                        <div className="p-1 pr-1 bg-gradient-to-br from-blue-500/20 to-purple-500/10 rounded-3xl">
                            <div className="bg-slate-950 p-10 rounded-[1.4rem] border border-white/5 space-y-8">
                                <h3 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                                    <Database className="text-blue-400" /> SCALABILITY PROTOCOL
                                </h3>

                                <div className="space-y-6">
                                    <div className="p-4 border-l-4 border-blue-500 bg-blue-500/5">
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Multi-City Mesh</p>
                                        <p className="text-sm text-slate-400 font-bold">Architecture supports independent regional instances with localized risk coefficients for global deployment.</p>
                                    </div>
                                    <div className="p-4 border-l-4 border-purple-500 bg-purple-500/5">
                                        <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">Policy Recalibration</p>
                                        <p className="text-sm text-slate-400 font-bold">Strategic mitigation simulations calculate efficacy deltas based on urban planning interventions.</p>
                                    </div>
                                    <div className="p-4 border-l-4 border-emerald-500 bg-emerald-500/5">
                                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">API-First Design</p>
                                        <p className="text-sm text-slate-400 font-bold">Standardized JSON outputs for integration with municipal emergency alert systems.</p>
                                    </div>
                                </div>

                                <Link
                                    href="/"
                                    className="block w-full text-center py-4 bg-blue-600 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-blue-500 transition-all shadow-[0_20px_40px_rgba(37,99,235,0.2)]"
                                >
                                    Experience the Twin
                                </Link>
                            </div>
                        </div>

                        <div className="p-8 glass-panel border-white/5 space-y-4">
                            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Technical Stack</h4>
                            <div className="flex flex-wrap gap-2">
                                {["Next.js 14", "Mapbox GL JS", "Framer Motion", "Zustand", "Tailwind CSS", "TypeScript", "Python Core"].map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-black text-slate-400 uppercase tracking-widest">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <footer className="relative z-10 py-12 px-8 border-t border-white/5 text-center">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">UrbanShield AI // Designed for Future Resilience</p>
            </footer>
        </div>
    );
}
