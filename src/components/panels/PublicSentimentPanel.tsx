"use client";

import { Users, TrendingUp, TrendingDown, MessageCircle, Heart, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRiskIntelligence } from '@/hooks/useRiskIntelligence';
import { useSimulationStore } from '@/store/useSimulationStore';

export default function PublicSentimentPanel() {
    const { cityMetrics } = useRiskIntelligence();
    const { viewMode } = useSimulationStore();

    // Sentiment inversely proportional to risk
    const cityAverageRisk = (cityMetrics.avgFlood + cityMetrics.avgHeat) / 2;
    const sentimentScore = Math.max(10, Math.floor(95 - (cityAverageRisk * 80)));
    const isCrisis = sentimentScore < 40;

    const sentiments = [
        { label: "Community Trust", val: sentimentScore + 5, icon: <Heart size={12} /> },
        { label: "Policy Support", val: Math.max(5, sentimentScore - 10), icon: <Users size={12} /> },
        { label: "System Confidence", val: Math.max(0, sentimentScore - 5), icon: <TrendingUp size={12} /> },
    ];

    const reactions = [
        { user: "@urban_advocate", text: isCrisis ? "Why are the barriers not deployed yet?" : "Impressive response time on the new cooling units.", type: isCrisis ? "neg" : "pos" },
        { user: "@city_grid_ops", text: isCrisis ? "Grid stress approaching critical levels." : "Load balancing optimal for current thermal surge.", type: isCrisis ? "neg" : "pos" },
        { user: "@eco_watcher", text: "Watching the digital twin results closely. Transparency is key.", type: "neu" },
    ];

    return (
        <div className="glass-panel p-5 w-80 border-white/5 relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase">Public Sentiment</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`text-2xl font-black ${isCrisis ? 'text-red-500' : 'text-emerald-400'}`}>{sentimentScore}%</span>
                        <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${isCrisis ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                            {isCrisis ? 'CRITICAL' : 'STABLE'}
                        </span>
                    </div>
                </div>
                <div className={`p-2 rounded-lg ${isCrisis ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
                    <MessageCircle size={16} className={isCrisis ? 'text-red-500' : 'text-emerald-400'} />
                </div>
            </div>

            <div className="space-y-4 mb-6">
                {sentiments.map(s => (
                    <div key={s.label}>
                        <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase">
                                {s.icon}
                                {s.label}
                            </div>
                            <span className="text-[9px] font-bold text-slate-300">{s.val}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${s.val}%` }}
                                className={`h-full ${isCrisis ? 'bg-red-500' : 'bg-emerald-500'}`}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-2 border-t border-white/5 pt-4">
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-2">Live Intel Feed</span>
                {reactions.map((r, i) => (
                    <div key={i} className="p-2 bg-white/5 rounded border border-white/5">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] font-bold text-blue-400">{r.user}</span>
                            {r.type === 'neg' && <AlertTriangle size={10} className="text-red-500" />}
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight italic">&quot;{r.text}&quot;</p>
                    </div>
                ))}
            </div>

            {/* Decorative background pulse */}
            <AnimatePresence>
                {isCrisis && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none"
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
