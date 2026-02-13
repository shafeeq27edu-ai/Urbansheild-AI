"use client";

import { ShieldCheck } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full py-6 mt-12 border-t border-white/5 bg-slate-950/50 backdrop-blur-sm z-50 relative pointer-events-auto">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">

                <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                    <ShieldCheck size={14} className="text-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        UrbanShield AI <span className="text-slate-600 mx-2">{'//'}</span> Climate Intelligence
                    </span>
                </div>

                <div className="flex items-center gap-6">
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                        Built for Sustainable Smart Cities
                    </span>
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                        v2.1.0-RC
                    </span>
                </div>
            </div>
        </footer>
    );
}
