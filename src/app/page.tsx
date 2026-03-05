"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from '@/services/apiClient';

import Header from '@/components/retro/Header';
import RiskPanel from '@/components/retro/RiskPanel';
import LocationSearch from '@/components/map/LocationSearch';
import UrbanMap from '@/components/map/UrbanMap';

export default function Home() {
    const [isLaunched, setIsLaunched] = useState(false);
    const [loading, setLoading] = useState(false);

    // Default to Bengaluru coordinates
    const [selectedCity, setSelectedCity] = useState("Bengaluru");
    const [selectedCoords, setSelectedCoords] = useState<[number, number]>([12.9716, 77.5946]);

    const [metrics, setMetrics] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const CITY_COORDS: Record<string, [number, number]> = {
        "Bengaluru": [12.9716, 77.5946],
        "Delhi": [28.6139, 77.2090],
        "Mumbai": [19.0760, 72.8777],
        "Chennai": [13.0827, 80.2707],
        "Hyderabad": [17.3850, 78.4867]
    };

    const fetchMetrics = async (city: string, lat?: number, lng?: number) => {
        setLoading(true);
        setError(null);
        try {
            const latitude = lat ?? selectedCoords[0];
            const longitude = lng ?? selectedCoords[1];

            const payload = {
                city,
                lat: latitude,
                lng: longitude
            };

            const res = await apiClient.fetch<any>("/api/stress-test", {
                method: "POST",
                body: JSON.stringify(payload)
            });

            if (res.success && res.data) {
                setMetrics(res.data);
            } else {
                throw new Error(res.error || "API returned an error");
            }
        } catch (err: any) {
            console.error("Prediction failed", err);
            setError(err.message || "SYSTEM ERROR: Backend API failed.");
        } finally {
            setLoading(false);
        }
    };

    const executeStressTest = async () => {
        fetchMetrics(selectedCity, selectedCoords[0], selectedCoords[1]);
    };

    const handleCityChange = (city: string) => {
        setSelectedCity(city);
        const coords = CITY_COORDS[city] || [12.9716, 77.5946];
        setSelectedCoords(coords);
    };

    const handleMapClick = (lat: number, lng: number) => {
        setSelectedCoords([lat, lng]);
        fetchMetrics(selectedCity, lat, lng);
    };

    const handleLocationSelect = (lat: number, lng: number, displayName: string) => {
        // Extract city from displayName if possible, otherwise use current selectedCity string
        const parts = displayName.split(",");
        const derivedCity = parts.length > 0 ? parts[0].trim() : selectedCity;
        setSelectedCity(derivedCity);
        setSelectedCoords([lat, lng]);
        fetchMetrics(derivedCity, lat, lng);
    };

    return (
        <main className="min-h-screen bg-[var(--color-bg)] flex flex-col font-sans">
            <AnimatePresence mode="wait">
                {!isLaunched ? (
                    <motion.div
                        key="entry"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        className="flex-1 flex flex-col items-center justify-center p-8 text-center"
                    >
                        <div className="civic-card max-w-2xl p-12 border-2 border-[var(--color-navy)] flex flex-col items-center gap-8 shadow-[12px_12px_0px_var(--color-navy)]">
                            <div className="flex flex-col items-center">
                                <h1 className="text-6xl font-black m-0 leading-[0.85] text-[var(--color-navy)] tracking-tighter uppercase">
                                    URBAN<br /><span className="text-[var(--color-accent)]">SHIELD</span>
                                </h1>
                            </div>
                            <button
                                onClick={() => setIsLaunched(true)}
                                className="civic-button px-16 py-5 text-lg"
                            >
                                INITIALIZE CONSOLE
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="console"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col flex-1"
                    >
                        <div className="page-wrapper relative">
                            {/* LIVE TELEMETRY BADGE inside Header implicitly, or just render it below Header */}
                            <div className="w-full bg-[var(--color-navy)] text-white text-[10px] font-black tracking-widest uppercase p-1 flex justify-between items-center px-4">
                                <span className={!error && metrics ? "text-green-400" : "text-slate-400"}>
                                    {!error && metrics ? "● LIVE TELEMETRY ACTIVE" : "● TELEMETRY OFFLINE"}
                                </span>
                            </div>

                            <Header
                                selectedCity={selectedCity}
                                onCityChange={handleCityChange}
                                overallRisk={metrics?.current?.compound_risk || 0}
                            />

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 flex-1">
                                <div className="lg:col-span-3">
                                    <button
                                        onClick={executeStressTest}
                                        disabled={loading}
                                        className="w-full bg-amber-500 text-white font-black py-4 uppercase mb-4 shadow-[4px_4px_0px_#b45309] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 flex items-center justify-center"
                                    >
                                        {loading ? "Running Urban Risk Simulation..." : "Execute Stress Test"}
                                    </button>

                                    {loading && (
                                        <div className="text-[10px] uppercase font-black tracking-widest text-[var(--color-navy)] animate-pulse flex items-center gap-2 mb-4">
                                            <div className="w-2 h-2 bg-[var(--color-accent)] rounded-full animate-bounce"></div>
                                            Downloading Telemetry & Modeling Prediction...
                                        </div>
                                    )}
                                </div>

                                <div className="lg:col-span-6 flex flex-col gap-4">
                                    {/* Location Search Bar */}
                                    <LocationSearch onSelectLocation={handleLocationSelect} />

                                    <div className="flex justify-between items-center bg-white/40 p-2 border border-[var(--color-navy)]/5 rounded-sm">
                                        <span className="text-[10px] font-black uppercase text-[var(--color-navy)] tracking-widest">
                                            Spatial Threat Mapping
                                        </span>
                                    </div>

                                    {/* Map is ALWAYS rendered regardless of error or metrics */}
                                    <div className="flex-1 min-h-[500px] relative border-2 border-[var(--color-navy)]">
                                        <UrbanMap
                                            center={selectedCoords}
                                            riskLevel={metrics?.current?.compound_risk || 0}
                                            onMapClick={handleMapClick}
                                        />

                                        {/* Overlay Error State over the map if it fails, but keep map visible beneath */}
                                        {error && (
                                            <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-red-500/10 backdrop-blur-sm pointer-events-none">
                                                <div className="text-center p-6 bg-white border-2 border-red-500 pointer-events-auto">
                                                    <h3 className="text-red-600 font-black uppercase tracking-widest mb-2 flex items-center gap-2 justify-center">
                                                        Connection Error
                                                    </h3>
                                                    <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">{error}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="lg:col-span-3 flex flex-col gap-6">
                                    {metrics ? (
                                        <RiskPanel data={{
                                            flood_risk_index: metrics.flood_risk_index !== undefined ? metrics.flood_risk_index : metrics.current?.flood_risk,
                                            heat_risk_index: metrics.heat_risk_index !== undefined ? metrics.heat_risk_index : metrics.current?.heat_risk,
                                            compound_risk_index: metrics.compound_risk_index !== undefined ? metrics.compound_risk_index : metrics.current?.compound_risk,
                                        }} />
                                    ) : (
                                        <div className="text-center font-bold text-slate-400">Run Stress Test to View Data</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
