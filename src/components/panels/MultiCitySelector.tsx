"use client";

import { useSimulationStore } from '@/store/useSimulationStore';
import { MapPin, Globe } from 'lucide-react';

export default function MultiCitySelector() {
    const { selectedCity, setSelectedCity } = useSimulationStore();

    const cities = ["BENGALURU", "CHENNAI", "DELHI", "MUMBAI"];

    return (
        <div className="flex items-center gap-3 glass-panel px-4 py-2 border-white/5 h-[44px]">
            <div className="flex items-center gap-2 pr-3 border-r border-white/10 text-blue-400">
                <Globe className="w-3.5 h-3.5" />
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Region</span>
            </div>

            <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent text-xs font-black text-white outline-none cursor-pointer hover:text-blue-400 transition-colors uppercase tracking-widest"
            >
                {cities.map(city => (
                    <option key={city} value={city} className="bg-slate-900 border-none">
                        {city}
                    </option>
                ))}
            </select>
            <MapPin className="w-3 h-3 text-slate-600 ml-1" />
        </div>
    );
}
