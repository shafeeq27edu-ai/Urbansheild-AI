"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export interface Toast {
    id: string;
    type: 'success' | 'warning' | 'info';
    message: string;
}

export default function SmartNotificationToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        const handleNotify = (e: any) => {
            const newToast = { id: Math.random().toString(), ...e.detail };
            setToasts(prev => [...prev, newToast]);
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== newToast.id));
            }, 5000);
        };

        window.addEventListener('US_NOTIFY', handleNotify);
        return () => window.removeEventListener('US_NOTIFY', handleNotify);
    }, []);

    return (
        <div className="fixed bottom-32 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {toasts.map(t => (
                    <motion.div
                        key={t.id}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 50, opacity: 0 }}
                        className="glass-panel p-4 w-72 border-white/10 pointer-events-auto flex gap-3 items-start shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute bottom-0 left-0 h-0.5 bg-blue-500/30 animate-shrink" style={{ width: '100%' }} />

                        <div className={`p-2 rounded-lg ${t.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                                t.type === 'warning' ? 'bg-red-500/10 text-red-500' :
                                    'bg-blue-500/10 text-blue-400'
                            }`}>
                            {t.type === 'success' && <CheckCircle className="w-4 h-4" />}
                            {t.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                            {t.type === 'info' && <Info className="w-4 h-4" />}
                        </div>

                        <div className="flex-1">
                            <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{t.type}</p>
                            <p className="text-[10px] text-slate-400 font-bold leading-tight">{t.message}</p>
                        </div>

                        <button onClick={() => setToasts(prev => prev.filter(toast => toast.id !== t.id))} className="text-slate-600 hover:text-white transition-colors">
                            <X className="w-3 h-3" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

export const notify = (type: 'success' | 'warning' | 'info', message: string) => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('US_NOTIFY', { detail: { type, message } }));
    }
};
