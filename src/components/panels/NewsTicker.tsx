"use client";

import { motion } from 'framer-motion';
import { useRiskIntelligence } from '@/hooks/useRiskIntelligence';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';

export default function NewsTicker() {
    const { cityMetrics, results } = useRiskIntelligence();

    // Generate technical-sounding news items based on city state
    const newsItems = [
        `[URGENT] ${cityMetrics.overallStatus} risk detected in ${cityMetrics.rankedZones[0]?.name}.`,
        `[INTEL] Resilience Score optimized at ${cityMetrics.resilienceScore.toFixed(0)}%.`,
        `[INFRA] Stress Level: ${cityMetrics.rankedZones[0]?.stressLevel} in critical sectors.`,
        "[CLIMATE] NOAA data feed synchronized with Digital Twin v1.0.",
        `[ESTIMATE] Projected economic exposure: $${cityMetrics.economicLoss.toFixed(1)}M/day.`,
        "[SYSTEM] Multi-layer inference engine recalibrating scenarios."
    ];

    if (cityMetrics.criticalCount > 0) {
        newsItems.unshift(`[WARNING] ${cityMetrics.criticalCount} zones exceed safety thresholds.`);
    }

    return (
        <div className="w-full bg-blue-600/10 border-y border-blue-500/20 backdrop-blur-md overflow-hidden h-8 flex items-center">
            <div className="flex items-center px-4 border-r border-blue-500/30 bg-blue-600/20 h-full z-10 shrink-0">
                <span className="text-[10px] font-black text-blue-400 tracking-[0.2em] flex items-center gap-2">
                    <ShieldAlert size={12} className="animate-pulse" />
                    LIVE INTEL FEED
                </span>
            </div>

            <motion.div
                animate={{ x: ["100%", "-200%"] }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="flex items-center gap-12 whitespace-nowrap pl-8"
            >
                {newsItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-slate-300 tracking-wider">
                            {item.toUpperCase()}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-blue-500/50" />
                    </div>
                ))}
                {/* Duplicate for seamless loop */}
                {newsItems.map((item, i) => (
                    <div key={`dup-${i}`} className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-slate-300 tracking-wider">
                            {item.toUpperCase()}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-blue-500/50" />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
