"use client";

import { Activity, AlertTriangle, Users, TrendingUp, Leaf, DollarSign, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRiskIntelligence } from '@/hooks/useRiskIntelligence';
import AnimatedCounter from '../ui/AnimatedCounter';

export default function CitySummaryPanel() {
    const { cityMetrics } = useRiskIntelligence();

    const statusColors = {
        'OPTIMAL': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]',
        'MODERATE': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
        'SEVERE': 'text-red-500 bg-red-500/10 border-red-500/20 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.2)]',
    };

    const resilienceColors = {
        'RESILIENT': 'text-blue-400',
        'VULNERABLE': 'text-orange-400',
        'HIGH RISK': 'text-red-500',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-5 w-full flex flex-row gap-8 items-center justify-between border-t border-white/10"
        >
            <div className="flex items-center gap-6">
                <div className="flex flex-col gap-2">
                    <div className={`px-5 py-2 rounded-full border text-[10px] font-black tracking-[0.25em] whitespace-nowrap backdrop-blur-sm ${statusColors[cityMetrics.overallStatus as keyof typeof statusColors]}`}>
                        STATUS: {cityMetrics.overallStatus}
                    </div>
                </div>

                <div className="h-12 w-px bg-white/5" />

                <div className="flex items-center gap-8">
                    <KPI
                        icon={<div className="text-blue-400"><Activity size={18} /></div>}
                        label="AVG FLOOD"
                        value={cityMetrics.avgFlood * 100}
                        suffix="%"
                        color="text-blue-400"
                    />
                    <KPI
                        icon={<div className="text-orange-400"><TrendingUp size={18} /></div>}
                        label="AVG HEAT"
                        value={cityMetrics.avgHeat * 100}
                        suffix="%"
                        color="text-orange-400"
                    />
                    <KPI
                        icon={<div className="text-red-500"><AlertTriangle size={18} /></div>}
                        label="CRITICAL ZONES"
                        value={cityMetrics.criticalCount}
                        color="text-red-500"
                        isInteger
                    />
                    <div className="h-8 w-px bg-white/5" />
                    <KPI
                        icon={<div className="text-emerald-400"><Leaf size={18} /></div>}
                        label="CARBON (TONS)"
                        value={cityMetrics.carbonFootprint / 1000}
                        suffix="K"
                        color="text-emerald-400"
                    />
                    <KPI
                        icon={<div className="text-yellow-400"><DollarSign size={18} /></div>}
                        label="Est. LOSS"
                        value={cityMetrics.economicLoss}
                        prefix="$"
                        suffix="M"
                        color="text-yellow-400"
                    />
                </div>
            </div>

            <div className="text-right">
                <div className="flex items-baseline gap-2 justify-end mb-1">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Resilience Score</span>
                    <span className={`text-xl font-black italic tracking-tighter ${resilienceColors[cityMetrics.resilienceStatus as keyof typeof resilienceColors]}`}>
                        <AnimatedCounter value={cityMetrics.resilienceScore} />
                    </span>
                </div>
                <div className="flex items-center justify-end gap-2">
                    <div className="h-1.5 w-32 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${cityMetrics.resilienceScore}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={`h-full ${resilienceColors[cityMetrics.resilienceStatus as keyof typeof resilienceColors]} bg-current shadow-[0_0_10px_currentColor]`}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function KPI({ icon, label, value, color, prefix = "", suffix = "", isInteger = false }: { icon: any, label: string, value: number, color: string, prefix?: string, suffix?: string, isInteger?: boolean }) {
    return (
        <div className="flex flex-col group hover:-translate-y-0.5 transition-transform duration-300">
            <div className="flex items-center gap-2 mb-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                {icon}
                <span className="text-[9px] text-slate-400 font-black tracking-tighter uppercase">{label}</span>
            </div>
            <div className={`text-2xl font-black italic tracking-tighter leading-none ${color} drop-shadow-sm flex items-baseline`}>
                {prefix}
                <AnimatedCounter value={value} />
                {suffix && <span className="text-sm ml-0.5 opacity-80">{suffix}</span>}
            </div>
        </div>
    );
}
