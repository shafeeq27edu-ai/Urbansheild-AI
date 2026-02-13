"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import DigitalTwinDashboard from '@/components/Dashboard';

import Footer from '@/components/ui/Footer';

// ... (Particlefield component remains same) ...

const Particlefield = () => (
    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="h-full w-full bg-[size:30px_30px] bg-[radial-gradient(circle_at_center,#1e293b_1px,transparent_1px)]" />
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0 bg-gradient-to-t from-blue-900/10 via-transparent to-blue-950/20"
        />
    </div>
);

export default function Home() {
    const [isLaunched, setIsLaunched] = useState(false);
    const [scrollPos, setScrollPos] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollPos(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AnimatePresence mode="wait">
            {!isLaunched ? (
                <motion.main
                    key="landing"
                    exit={{ opacity: 0, scale: 0.95, filter: "blur(40px)", y: -50 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="relative min-h-[150vh] w-full bg-slate-950 text-white selection:bg-blue-500/30"
                >
                    {/* STICKY CONTENT */}
                    <section className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
                        <Particlefield />

                        {/* Animated Globe / Pulse Proxy */}
                        <motion.div
                            style={{ scale: 1 + scrollPos * 0.0005, opacity: 1 - scrollPos * 0.002 }}
                            className="absolute z-0 pointer-events-none"
                        >
                            <div className="h-[600px] w-[600px] rounded-full border border-blue-500/10 bg-blue-500/5 blur-[80px] animate-pulse" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full border border-cyan-500/5" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="relative z-10 text-center px-4 max-w-5xl"
                        >
                            <motion.div
                                className="mb-8 inline-flex items-center gap-3 rounded-full border border-blue-500/30 bg-blue-500/10 px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                            >
                                <div className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
                                Planetary Intelligence v2.0
                            </motion.div>

                            <h1 className="mb-6 text-7xl font-black tracking-tighter sm:text-[10rem] leading-[0.85] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-500 drop-shadow-2xl">
                                URBAN<br /><span className="text-blue-500">SHIELD</span>
                            </h1>

                            <p className="mx-auto mt-8 max-w-2xl text-lg text-slate-400 sm:text-2xl font-light leading-relaxed tracking-tight">
                                Architecting urban resilience through <span className="text-white font-medium italic">Predictive Intelligence</span>.
                                <br />A Digital Twin framework for climate-responsive governance.
                            </p>

                            <div className="mt-16 flex flex-wrap justify-center gap-8">
                                <button
                                    onClick={() => setIsLaunched(true)}
                                    className="group relative overflow-hidden rounded-full bg-white px-12 py-5 font-black uppercase tracking-widest text-slate-950 transition-all hover:scale-105 active:scale-95 hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] shadow-2xl"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        Launch System
                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600 group-hover:animate-bounce" />
                                    </span>
                                </button>

                                <button className="rounded-full border border-slate-700 bg-slate-900/50 px-12 py-5 font-black uppercase tracking-widest text-slate-200 backdrop-blur-md transition-all hover:bg-slate-800 hover:border-slate-500 ring-1 ring-white/5">
                                    Methodology
                                </button>
                            </div>
                        </motion.div>

                        {/* Scroll Indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2 }}
                            className="absolute bottom-12 flex flex-col items-center gap-2 text-slate-500"
                        >
                            <span className="text-[10px] uppercase font-black tracking-[0.3em]">Scroll for Context</span>
                            <div className="h-12 w-px bg-gradient-to-b from-blue-500 to-transparent" />
                        </motion.div>
                    </section>

                    {/* BELOW THE FOLD DECOR */}
                    <section className="relative h-[100vh] bg-slate-950 px-12 py-24 z-20 flex flex-col justify-between">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto w-full">
                            {[
                                { title: "MICRO-INFERENCE", desc: "Hyper-local risk projections calculated at 5m resolution using edge-accelerated neural weights.", icon: "01" },
                                { title: "ADAPTIVE DEFENSE", desc: "Dynamic policy recommendations that adapt instantly to changing precipitation and thermal profiles.", icon: "02" },
                                { title: "SIMULATION GRID", desc: "Explore millions of 'What-If' scenarios to stress-test your city against future climate extremes.", icon: "03" }
                            ].map(card => (
                                <div key={card.title} className="glass-card p-12 border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                                    <div className="text-4xl font-black text-blue-500/20 mb-8 font-mono group-hover:text-blue-500/40 transition-colors">{card.icon}</div>
                                    <h3 className="text-xl font-bold text-white mb-4 tracking-tight">{card.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{card.desc}</p>
                                </div>
                            ))}
                        </div>

                        <Footer />
                    </section>
                </motion.main>
            ) : (
                <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed inset-0 z-[100]"
                >
                    <DigitalTwinDashboard setIsLaunched={setIsLaunched} />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
