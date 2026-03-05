"use client";

import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, MapPin, Menu } from 'lucide-react';
import IntelligenceMenu from '../navigation/IntelligenceMenu';

interface HeaderProps {
    selectedCity: string;
    onCityChange: (city: string) => void;
    overallRisk: number;
}

const Header: React.FC<HeaderProps> = ({ selectedCity, onCityChange, overallRisk }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const cities = ["Bengaluru", "Delhi", "Mumbai", "Chennai", "Hyderabad"];

    const getRiskStatus = () => {
        if (overallRisk > 85) return { label: "CRITICAL", color: "var(--color-muted-red)" };
        if (overallRisk > 65) return { label: "HIGH", color: "#d97706" };
        if (overallRisk > 35) return { label: "ELEVATED", color: "var(--color-accent)" };
        return { label: "STABLE", color: "var(--color-forest)" };
    };

    const status = getRiskStatus();

    return (
        <header className="w-full bg-white border-b border-[var(--color-navy)]/10 px-8 py-4 flex justify-between items-center shadow-sm sticky top-0 z-[1000]">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="text-[var(--color-navy)] w-8 h-8" />
                    <div>
                        <h1 className="text-2xl font-black m-0 leading-none uppercase tracking-tighter">
                            URBAN<span className="text-[var(--color-accent)]">SHIELD</span>
                        </h1>
                        <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--color-charcoal)]/60 uppercase">
                            Civic Intelligence & Risk Console
                        </span>
                    </div>
                </div>

                <div className="h-10 w-px bg-[var(--color-navy)]/10 mx-2 hidden md:block" />

                <div className="relative hidden md:block">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-2 bg-[var(--color-bg)] px-4 py-2 rounded-sm border border-[var(--color-navy)]/20 hover:border-[var(--color-navy)]/40 transition-all font-bold text-xs uppercase tracking-widest text-[var(--color-navy)]"
                    >
                        <MapPin size={14} className="text-[var(--color-accent)]" />
                        Jurisdiction: {selectedCity}
                        <ChevronDown size={14} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showDropdown && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-[var(--color-navy)]/20 shadow-xl rounded-sm py-2 z-[2000] animate-in fade-in slide-in-from-top-2">
                            {cities.map(city => (
                                <button
                                    key={city}
                                    onClick={() => {
                                        onCityChange(city);
                                        setShowDropdown(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-[var(--color-bg)] transition-colors ${selectedCity === city ? 'text-[var(--color-accent)]' : 'text-[var(--color-navy)]'}`}
                                >
                                    {city}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-2 bg-[var(--color-navy)]/5 border border-[var(--color-navy)]/10 px-3 py-1.5 rounded-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-[var(--color-navy)]">LIVE TELEMETRY ACTIVE</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-[var(--color-charcoal)]/50 uppercase tracking-widest">System Sentiment</span>
                    <div
                        className="civic-status-badge text-white"
                        style={{ backgroundColor: status.color, boxShadow: `0 0 15px ${status.color}44` }}
                    >
                        {status.label}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
