"use client";

import { AlertOctagon, X, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRiskIntelligence } from '@/hooks/useRiskIntelligence';
import { useSound } from '@/hooks/useSound';

export default function EmergencyAlertOverlay() {
    const { cityMetrics } = useRiskIntelligence();
    const [isVisible, setIsVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const { play } = useSound('alert');

    useEffect(() => {
        if (cityMetrics.criticalCount > 0 && !dismissed) {
            setIsVisible(true);
            play();
        } else {
            setIsVisible(false);
        }
    }, [cityMetrics.criticalCount, dismissed, play]);

    // Reset dismissal if situation clears and then recurs
    useEffect(() => {
        if (cityMetrics.criticalCount === 0) {
            setDismissed(false);
        }
    }, [cityMetrics.criticalCount]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="fixed top-0 left-0 right-0 z-[100] p-4 flex justify-center pointer-events-none"
                >
                    <div className="relative bg-gradient-to-r from-red-600/90 to-red-900/90 backdrop-blur-xl border border-red-400/50 shadow-[0_0_80px_rgba(220,38,38,0.6)] w-full max-w-4xl py-4 px-8 flex items-center justify-between pointer-events-auto rounded-2xl overflow-hidden group">

                        {/* Animated Pulse Border */}
                        <div className="absolute inset-0 border-2 border-red-500 rounded-2xl animate-pulse opacity-50" />
                        <div className="absolute inset-0 bg-red-500/10 animate-pulse mix-blend-overlay" />

                        <div className="flex items-center gap-6 relative z-10">
                            <div className="bg-white p-3 rounded-xl animate-[pulse_1s_ease-in-out_infinite] shadow-lg shadow-red-900/50">
                                <AlertOctagon className="w-8 h-8 text-red-600" />
                            </div>
                            <div>
                                <h2 className="text-white font-black italic tracking-tighter text-2xl leading-none drop-shadow-md">
                                    CRITICAL RISK ALERT
                                </h2>
                                <p className="text-red-100 text-[11px] uppercase font-bold tracking-[0.2em] mt-1 shadow-black/20">
                                    {cityMetrics.criticalCount} ZONES EXCEED SAFETY PARAMETERS
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 relative z-10">
                            <div className="text-right hidden sm:block">
                                <p className="text-white text-[10px] font-black uppercase tracking-widest">Protocol 7 Initiated</p>
                                <p className="text-red-200 text-[10px] font-mono italic">DEPLOYING_COUNTERMEASURES...</p>
                            </div>
                            <button
                                onClick={() => setDismissed(true)}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors group border border-white/10"
                            >
                                <X className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
