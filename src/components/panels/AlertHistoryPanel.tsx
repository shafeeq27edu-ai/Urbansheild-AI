"use client";

import { useSimulationStore } from '@/store/useSimulationStore';
import { History, Clock, MapPin, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export interface AlertLog {
    id: string;
    timestamp: string;
    zone: string;
    severity: 'MODERATE' | 'HIGH' | 'CRITICAL';
    type: 'FLOOD' | 'HEAT';
}

export default function AlertHistoryPanel() {
    const { rainfallIncrease, tempIncrease } = useSimulationStore();
    const [history, setHistory] = useState<AlertLog[]>([]);

    useEffect(() => {
        if (rainfallIncrease > 150 || tempIncrease > 40) {
            const newAlert: AlertLog = {
                id: Math.random().toString(),
                timestamp: new Date().toLocaleTimeString([], { hour12: false }),
                zone: 'Central Business Dist.',
                severity: rainfallIncrease > 180 ? 'CRITICAL' : 'HIGH',
                type: rainfallIncrease > 150 ? 'FLOOD' : 'HEAT'
            };
            setHistory(prev => [newAlert, ...prev].slice(0, 10));
        }
    }, [rainfallIncrease, tempIncrease]);

    return (
        <div className="glass-panel p-4 w-72 border-white/5 bg-slate-900/40">
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                <History className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Logs</span>
            </div>

            <div className="space-y-3 max-h-[250px] overflow-y-auto no-scrollbar">
                {history.length === 0 ? (
                    <div className="py-8 text-center">
                        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest italic">No active violations detected</p>
                    </div>
                ) : (
                    history.map(log => (
                        <div key={log.id} className="flex gap-3 items-start border-l-2 border-slate-800 pl-3 py-1 group hover:border-blue-500 transition-colors">
                            <div className="pt-1">
                                {log.severity === 'CRITICAL' ? <AlertCircle className="w-3 h-3 text-red-500" /> : <Clock className="w-3 h-3 text-slate-500" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-0.5">
                                    <span className="text-[9px] font-black text-slate-200 uppercase tracking-tighter">{log.type} {'//'} {log.zone}</span>
                                    <span className="text-[8px] font-mono text-slate-500">{log.timestamp}</span>
                                </div>
                                <div className={`text-[8px] font-black uppercase tracking-widest ${log.severity === 'CRITICAL' ? 'text-red-500' : 'text-orange-500'
                                    }`}>
                                    Status: {log.severity}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
