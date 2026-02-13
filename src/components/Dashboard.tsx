"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useSimulationStore } from '@/store/useSimulationStore';
import { useRiskIntelligence } from '@/hooks/useRiskIntelligence';

// Main Panels
import SimulationPanel from './panels/SimulationPanel';
import AIExplanationPanel from './panels/AIExplanationPanel';
import CIAssistantPanel from './panels/CIAssistantPanel';
import CitySummaryPanel from './panels/CitySummaryPanel';
import EmergencyAlertOverlay from './panels/EmergencyAlertOverlay';
import ZoneRankingPanel from './panels/ZoneRankingPanel';
import ScenarioComparisonPanel from './panels/ScenarioComparisonPanel';
import NewsTicker from './panels/NewsTicker';
import ZoneDrillDownModal from './panels/ZoneDrillDownModal';
import ActionPlanModal from './panels/ActionPlanModal';
import PublicSentimentPanel from './panels/PublicSentimentPanel';
import ZoneGrid from './panels/ZoneGrid';

// Control Room Polish Panels
import AISystemStatus from './panels/AISystemStatus';
import RiskThresholdPanel from './panels/RiskThresholdPanel';
import ScenarioPresets from './panels/ScenarioPresets';
import DataConfidenceInfo from './panels/DataConfidenceInfo';
import MapLegend from './panels/MapLegend';
import ImpactGauge from './panels/ImpactGauge';
import RiskStabilityIndicator from './panels/RiskStabilityIndicator';
import MultiCitySelector from './panels/MultiCitySelector';
import SmartNotificationToast, { notify } from './panels/SmartNotificationToast';
import MitigationEffectivenessScore from './panels/MitigationEffectivenessScore';
import RiskRadarChart from './panels/RiskRadarChart';
import AlertHistoryPanel from './panels/AlertHistoryPanel';

import { Eye, EyeOff, FileDown, Minimize2, Settings, Zap, PlayCircle, ShieldCheck, Activity } from 'lucide-react';
import AIPulseBackground from './ui/AIPulseBackground';

const ClimateMap = dynamic(() => import('@/components/map/ClimateMap'), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950" />
            <div className="flex items-center gap-3 relative z-10 animate-pulse">
                <ShieldCheck className="w-8 h-8 text-blue-500" />
                <span className="text-xl font-black tracking-[0.2em] text-white">INITIALIZING TWIN...</span>
            </div>
            <div className="mt-4 w-48 h-1 bg-slate-800 rounded-full overflow-hidden relative z-10">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="h-full bg-blue-500"
                />
            </div>
        </div>
    )
});

const Particlefield = () => (
    <div className="absolute inset-0 z-0 opacity-10 pointer-events-none mix-blend-screen">
        <div className="h-full w-full bg-[size:40px_40px] bg-[linear-gradient(to_right,#3b82f6_1px,transparent_1px),linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)] opacity-20" />
        <AIPulseBackground />
    </div>
);

export default function DigitalTwinDashboard({ setIsLaunched }: { setIsLaunched: (val: boolean) => void }) {
    const {
        timeStep,
        setTimeStep,
        rainfallIncrease,
        tempIncrease,
        setRainfall,
        setTemp,
        cleanViewActive,
        setCleanViewActive,
        focusedZoneId,
        actionPlanVisible,
        setActionPlanVisible,
        selectedCity,
        calibrationModeActive,
        setCalibrationModeActive,
        autoPilotActive,
        setAutoPilotActive,
        setMitigationActive
    } = useSimulationStore();

    const { cityMetrics } = useRiskIntelligence();
    const [isDemoMode, setIsDemoMode] = useState(false);

    const overallRisk = Math.max(cityMetrics.avgFlood, cityMetrics.avgHeat);
    const isCrisisTheme = overallRisk > 0.75;

    // cinematic sequence logic
    const triggerCinematicSequence = async () => {
        setAutoPilotActive(true);
        notify('info', 'UNLEASHING DEMO SEQUENCE: SIMULATING CRITICAL CLIMATE EVENT');

        // 1. Increase Rain
        for (let i = 0; i <= 180; i += 20) {
            setRainfall(i);
            await new Promise(r => setTimeout(r, 800));
        }

        // 2. Increase Temp
        for (let i = 0; i <= 42; i += 5) {
            setTemp(i);
            await new Promise(r => setTimeout(r, 500));
        }

        notify('warning', 'CRITICAL OVERRIDE DETECTED. MULTI-ZONE VULNERABILITY REACHED.');

        // 3. Wait for dramatic effect
        await new Promise(r => setTimeout(r, 3000));

        // 4. Apply Mitigation
        notify('success', 'AI COUNTERMEASURES ACTIVATED: DEPLOYING DRAINAGE MESH & HEAT SINKS');
        setMitigationActive(true);

        await new Promise(r => setTimeout(r, 5000));
        setAutoPilotActive(false);
    };

    // Keyboard Hotkeys
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'c') setCleanViewActive(!useSimulationStore.getState().cleanViewActive);
            if (e.key.toLowerCase() === 'p') triggerCinematicSequence();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Demo Mode Logic (Standard micro-variation)
    useEffect(() => {
        if (!isDemoMode || autoPilotActive) return;

        const interval = setInterval(() => {
            const newRain = rainfallIncrease + (Math.random() * 10 - 5);
            const newTemp = tempIncrease + (Math.random() * 2 - 1);
            setRainfall(Math.max(0, Math.min(200, newRain)));
            setTemp(Math.max(-10, Math.min(50, newTemp)));
        }, 3000);

        return () => clearInterval(interval);
    }, [isDemoMode, autoPilotActive, rainfallIncrease, tempIncrease, setRainfall, setTemp]);

    // Toast triggers for changes
    useEffect(() => {
        if (autoPilotActive) return;
        if (rainfallIncrease > 100) notify('warning', `Elevated Rainfall delta detected for ${selectedCity}. Recalibrating hydrology mesh.`);
        if (tempIncrease > 35) notify('warning', `Critical Heat Dome formation localized in downtown sector.`);
    }, [rainfallIncrease, tempIncrease, selectedCity, autoPilotActive]);

    const timelineSteps = ["PRESENT", "NEXT 24H", "3 DAYS", "7 DAYS"];

    return (
        <div className={`relative h-screen w-full transition-colors duration-1000 overflow-hidden font-sans pb-10 ${isCrisisTheme ? 'bg-slate-950' : 'bg-slate-950'}`}>
            <EmergencyAlertOverlay />
            <Particlefield />
            <SmartNotificationToast />

            {/* Base Map Layer */}
            <div className="absolute inset-0 z-0">
                <ClimateMap />
            </div>

            {/* Top Header Layer */}
            <header className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
                <div className="px-8 py-6 flex justify-between items-start">
                    <div className="pointer-events-auto">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20 backdrop-blur-md">
                                    <ShieldCheck className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black tracking-tighter text-white leading-none">
                                        URBAN<span className="text-blue-500">SHIELD</span>
                                    </h1>
                                    <span className="text-[9px] font-bold tracking-[0.3em] text-slate-500 uppercase block mt-0.5">
                                        AI Climate Intelligence
                                    </span>
                                </div>
                            </div>

                            <div className="h-8 w-px bg-white/10 mx-2" />

                            <button
                                onClick={() => setIsLaunched(false)}
                                className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all hover:pr-4"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 group-hover:bg-red-400 transition-colors" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">
                                    Exit
                                </span>
                            </button>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-block w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px] ${isDemoMode ? 'bg-purple-500 shadow-purple-500' : 'bg-emerald-500 shadow-emerald-500'}`} />
                            <span className={`text-[10px] font-bold tracking-[0.3em] uppercase ${isDemoMode ? 'text-purple-400' : 'text-emerald-400/80'}`}>
                                {isDemoMode ? 'Live Simulation Active' : 'Inference Engine Active'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pointer-events-auto">
                        <MultiCitySelector />

                        <button
                            onClick={triggerCinematicSequence}
                            disabled={autoPilotActive}
                            className={`glass-panel p-3 border-blue-500/30 hover:bg-blue-500/10 transition-all group flex items-center gap-2 ${autoPilotActive ? 'opacity-50 grayscale' : ''}`}
                            title="Ultimate Cinematic Demo (P)"
                        >
                            <PlayCircle size={18} className={autoPilotActive ? 'text-blue-600 animate-spin' : 'text-blue-400'} />
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Demo</span>
                        </button>

                        <button
                            onClick={() => setCalibrationModeActive(!calibrationModeActive)}
                            className={`glass-panel p-3 border-white/10 hover:bg-white/5 transition-all group ${calibrationModeActive ? 'border-orange-500/50 bg-orange-500/5' : ''}`}
                            title="Toggle Calibration Mode"
                        >
                            <Settings className={`w-4.5 h-4.5 ${calibrationModeActive ? 'text-orange-400 animate-spin' : 'text-slate-400'}`} />
                        </button>

                        <button
                            onClick={() => setCleanViewActive(!cleanViewActive)}
                            className={`glass-panel p-3 border-white/10 hover:bg-white/5 transition-all group ${isCrisisTheme ? 'border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : ''}`}
                            title="Toggle Clean View (C)"
                        >
                            {cleanViewActive ? <EyeOff className="w-4.5 h-4.5 text-blue-400" /> : <Eye className="w-4.5 h-4.5 text-slate-400 group-hover:text-white" />}
                        </button>

                        <div className="flex items-center gap-3 glass-panel px-4 py-2 border-white/5 h-[44px]">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Auto-Pilot</span>
                            <button
                                onClick={() => setIsDemoMode(!isDemoMode)}
                                className={`w-10 h-5 rounded-full relative transition-colors ${isDemoMode ? 'bg-purple-600' : 'bg-slate-700'}`}
                            >
                                <motion.div
                                    animate={{ x: isDemoMode ? 20 : 2 }}
                                    className="absolute top-1 w-3 h-3 bg-white rounded-full"
                                />
                            </button>
                        </div>

                        <button
                            onClick={() => setActionPlanVisible(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all active:scale-95"
                        >
                            <FileDown className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>

                <NewsTicker />
            </header>

            {/* CALIBRATION WARNING */}
            <AnimatePresence>
                {calibrationModeActive && (
                    <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
                        className="absolute top-24 left-1/2 -translate-x-1/2 z-[31] bg-orange-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-xl"
                    >
                        <Zap className="w-3 h-3 animate-pulse" />
                        Calibration Mode Active: Manual Parameter Override Enabled
                    </motion.div>
                )}
            </AnimatePresence>

            {/* EXIT CLEAN VIEW CALLOUT */}
            <AnimatePresence>
                {cleanViewActive && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[60] py-3 px-6 glass-panel border-blue-500/50 bg-blue-500/5 animate-pulse"
                    >
                        <button
                            onClick={() => setCleanViewActive(false)}
                            className="flex items-center gap-3 pointer-events-auto"
                        >
                            <Minimize2 className="text-blue-400 w-4 h-4" />
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">EXIT CINEMATIC VIEW (C)</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main UI Panels */}
            <main className="absolute inset-0 z-10 pointer-events-none">
                <AnimatePresence>
                    {!cleanViewActive && (
                        <>
                            {/* Center Top: Summary Card */}
                            <motion.div
                                initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
                                className="absolute top-32 left-1/2 -translate-x-1/2 pointer-events-auto w-full max-w-4xl"
                            >
                                <CitySummaryPanel />
                            </motion.div>

                            {/* Left Side: Controls & System Info */}
                            <div className="absolute top-56 left-8 pointer-events-auto flex flex-col gap-4 max-h-[75vh] overflow-y-auto no-scrollbar pb-12 pr-2">
                                <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.05 }}>
                                    <AISystemStatus />
                                </motion.div>
                                <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                                    <SimulationPanel />
                                </motion.div>
                                <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
                                    <ScenarioPresets />
                                </motion.div>
                                <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                                    <RiskThresholdPanel />
                                </motion.div>
                                <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
                                    <ScenarioComparisonPanel />
                                </motion.div>
                                <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                                    <MapLegend />
                                </motion.div>
                            </div>

                            {/* Right Side: AI Insights & Assistant */}
                            <div className="absolute top-32 right-8 pointer-events-auto flex flex-col gap-6 max-h-[85vh] overflow-y-auto no-scrollbar pr-1 pb-20">
                                <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                                    <AIExplanationPanel />
                                </motion.div>

                                <div className="flex gap-4">
                                    <RiskStabilityIndicator />
                                    <RiskRadarChart />
                                </div>

                                <div className="flex gap-4">
                                    <ImpactGauge />
                                    <MitigationEffectivenessScore />
                                </div>

                                <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                                    <ZoneGrid />
                                </motion.div>

                                <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                                    <AlertHistoryPanel />
                                </motion.div>

                                <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                                    <PublicSentimentPanel />
                                </motion.div>

                                <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                                    <DataConfidenceInfo />
                                </motion.div>

                                <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
                                    <CIAssistantPanel />
                                </motion.div>
                            </div>

                            {/* Bottom Center: Timeline */}
                            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-auto">
                                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="glass-panel px-8 py-4 w-[600px]">
                                    <div className="flex justify-between mb-4">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Intelligence Timeline projection</span>
                                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none">Confidence: High</span>
                                    </div>

                                    <div className="relative h-1 bg-slate-800 rounded-full flex justify-between items-center px-2">
                                        <div className="absolute top-0 bottom-0 left-0 bg-blue-500/30 transition-all duration-500 rounded-full" style={{ width: `${(timeStep / 3) * 100}%` }} />
                                        {timelineSteps.map((step, idx) => (
                                            <button key={step} onClick={() => setTimeStep(idx)} className="relative z-10 group" >
                                                <div className={`w-3 h-3 rounded-full transition-all border-2 ${timeStep === idx ? 'bg-blue-500 border-white scale-125 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'bg-slate-700 border-slate-600 hover:border-slate-400'}`} />
                                                <span className={`absolute top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold whitespace-nowrap transition-all ${timeStep === idx ? 'text-blue-400 font-black' : 'text-slate-500 opacity-60'}`} > {step} </span>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </>
                    )}
                </AnimatePresence>
            </main>

            {/* MODALS */}
            <AnimatePresence>
                {focusedZoneId && <ZoneDrillDownModal />}
            </AnimatePresence>
            <AnimatePresence>
                {actionPlanVisible && <ActionPlanModal onClose={() => setActionPlanVisible(false)} />}
            </AnimatePresence>

            {/* Decorative Overlays */}
            <div className={`absolute inset-0 pointer-events-none border-[24px] z-[55] overflow-hidden transition-colors duration-1000 ${isCrisisTheme ? 'border-red-500/10' : 'border-slate-950/20'}`}>
                <div className={`absolute top-0 left-0 w-full h-full transition-colors duration-1000 ${isCrisisTheme ? 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(69,10,10,0.4)_100%)]' : 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.3)_100%)]'}`} />
                <div className="absolute bottom-4 left-8 text-[8px] font-black text-slate-700 uppercase tracking-[0.5em] z-[60]">UrbanShield AI // Strategic Core // Hackathon Build v1.0</div>
            </div>
        </div>
    );
}
