"use client";

import { motion } from 'framer-motion';
import { Activity, Shield, Cpu, CloudLightning } from 'lucide-react';

export default function AISystemStatus() {
    const statusItems = [
        { label: "Model Status", value: "Active", icon: <Cpu className="w-3 h-3" />, color: "text-emerald-400" },
        { label: "Edge Mode", value: "Enabled", icon: <Shield className="w-3 h-3" />, color: "text-blue-400" },
        { label: "Data Refresh", value: "Live", icon: <CloudLightning className="w-3 h-3" />, color: "text-emerald-400" },
        { label: "System Health", value: "Stable", icon: <Activity className="w-3 h-3" />, color: "text-emerald-400" },
    ];

    return (
        <div className="glass-panel p-4 w-48 border-white/5 bg-slate-900/40">
            <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Control</span>
            </div>

            <div className="space-y-3">
                {statusItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center group">
                        <div className="flex items-center gap-2 text-slate-500 group-hover:text-slate-300 transition-colors">
                            {item.icon}
                            <span className="text-[9px] font-bold uppercase tracking-tight">{item.label}</span>
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-tighter ${item.color}`}>
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-2 border-t border-white/5">
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }}
                            className="h-1 flex-1 bg-blue-500/20 rounded-full overflow-hidden"
                        >
                            <div className="h-full bg-blue-400/40 w-full animate-progress" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
