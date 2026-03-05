"use client";

import { Activity, ShieldCheck, Zap, Users } from 'lucide-react';
import { CustomCountUp as CountUp, CustomTilt as Tilt } from './CustomAnimations';

interface RiskPanelProps {
    data: any;
}

const RiskPanel: React.FC<RiskPanelProps> = ({ data }) => {
    if (!data) return (
        <div className="civic-card flex flex-col items-center justify-center p-12 opacity-50 grayscale">
            <Activity size={32} className="text-[var(--color-navy)] mb-4 animate-pulse" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-charcoal)]">Waiting for simulation data...</p>
        </div>
    );

    const metrics = [
        { label: "Flood Risk Index", val: data.flood_risk_index, icon: <Zap size={16} />, color: "var(--color-accent)" },
        { label: "Heat Stress Index", val: data.heat_risk_index, icon: <Activity size={16} />, color: "var(--color-copper)" },
        { label: "Compound Risk", val: data.compound_risk_index, icon: <ShieldCheck size={16} />, color: "var(--color-navy)" }
    ];

    const getBarColor = (val: number) => {
        if (val > 85) return 'meter-fill-high';
        if (val > 35) return 'meter-fill-mod';
        return 'meter-fill-low';
    };

    // Upgrade 3: Risk Change Pulse
    const isCriticalEscape = data.compound_risk_index > 70;

    return (
        <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3}>
            <div className={`civic-card flex flex-col gap-6 transition-all duration-700 ${isCriticalEscape ? 'shadow-[0_0_20px_rgba(220,38,38,0.4)] border-red-500 border-2 animate-pulse' : ''}`}>
                <h2 className="text-xl m-0 font-black uppercase tracking-tight border-b border-[var(--color-navy)]/10 pb-4">
                    Intelligence Metrics
                </h2>

                <div className="flex flex-col gap-6">
                    {metrics.map((m) => (
                        <div key={m.label} className="risk-meter-container">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div style={{ color: m.color }}>{m.icon}</div>
                                    <label className="m-0 font-black text-[10px] uppercase tracking-[0.15em] text-[var(--color-charcoal)]/60">
                                        {m.label}
                                    </label>
                                </div>
                                <span className="font-serif text-2xl font-black text-[var(--color-navy)]">
                                    <CountUp end={m.val} duration={1.2} decimals={0} /> <span className="text-xs font-sans font-bold text-[var(--color-charcoal)]/30">/ 100</span>
                                </span>
                            </div>
                            <div className="meter-bar">
                                {/* Upgrade 2: Smooth Metric Animation */}
                                <div
                                    className={`meter-fill ${getBarColor(m.val)} transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]`}
                                    style={{ width: `${m.val}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="bg-[var(--color-bg)] p-3 rounded-sm border border-[var(--color-navy)]/10">
                        <div className="flex items-center gap-2 mb-1">
                            <Activity size={12} className="text-[var(--color-navy)]/60" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-[var(--color-charcoal)]/60">Risk Velocity</span>
                        </div>
                        <p className="text-lg font-black m-0 leading-none">
                            {data.risk_velocity || "1.0x"}
                        </p>
                    </div>
                    <div className="bg-[var(--color-bg)] p-3 rounded-sm border border-[var(--color-navy)]/10">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap size={12} className="text-[var(--color-navy)]/60" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-[var(--color-charcoal)]/60">Escalation (6h)</span>
                        </div>
                        <p className="text-lg font-black m-0 leading-none">
                            {data.temporal_escalation_6h || "+0%"}
                        </p>
                    </div>
                </div>

                <div className="mt-2 pt-4 border-t border-[var(--color-navy)]/10">
                    <label className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--color-charcoal)]/60 mb-2 block">Systemic Stress Drivers</label>
                    <div className="flex flex-wrap gap-2">
                        {(data.top_drivers || ["Metric Latency", "Data Incomplete"]).map((d: string) => (
                            <span key={d} className="bg-[var(--color-navy)]/5 text-[var(--color-navy)] px-2 py-1 rounded-full text-[9px] font-bold border border-[var(--color-navy)]/10 uppercase">
                                {d.replace(/_/g, ' ')}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </Tilt>
    );
};

export default RiskPanel;
