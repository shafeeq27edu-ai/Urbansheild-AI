import { create } from 'zustand';

interface SimulationState {
    rainfallIncrease: number;
    tempIncrease: number;
    viewMode: 'flood' | 'heat';
    timeStep: number; // 0, 1, 2 (24h, 3d, 7d)
    mitigationActive: boolean;
    isCalculating: boolean;
    cleanViewActive: boolean;
    focusedZoneId: string | null;
    actionPlanVisible: boolean;
    mapStyle: string;
    floodThreshold: number;
    heatThreshold: number;
    selectedCity: string;
    calibrationModeActive: boolean;
    autoPilotActive: boolean;
    setRainfall: (val: number) => void;
    setTemp: (val: number) => void;
    setViewMode: (mode: 'flood' | 'heat') => void;
    setTimeStep: (step: number) => void;
    setMitigationActive: (active: boolean) => void;
    setIsCalculating: (val: boolean) => void;
    setCleanViewActive: (val: boolean) => void;
    setFocusedZoneId: (id: string | null) => void;
    setActionPlanVisible: (val: boolean) => void;
    setFloodThreshold: (val: number) => void;
    setHeatThreshold: (val: number) => void;
    drainageEfficiency: number;
    setSelectedCity: (city: string) => void;
    setCalibrationModeActive: (val: boolean) => void;
    setAutoPilotActive: (val: boolean) => void;
    setDrainageEfficiency: (val: number) => void;
    reset: () => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
    rainfallIncrease: 0,
    tempIncrease: 0,
    viewMode: 'flood',
    timeStep: 0,
    mitigationActive: false,
    isCalculating: false,
    cleanViewActive: false,
    focusedZoneId: null,
    actionPlanVisible: false,
    mapStyle: 'dark',
    floodThreshold: 0.85,
    heatThreshold: 0.85,
    drainageEfficiency: 0,
    selectedCity: 'BENGALURU',
    calibrationModeActive: false,
    autoPilotActive: false,
    setRainfall: (val) => set({ rainfallIncrease: val }),
    setTemp: (val) => set({ tempIncrease: val }),
    setViewMode: (mode) => set({ viewMode: mode }),
    setTimeStep: (step) => set({ timeStep: step }),
    setMitigationActive: (active) => set({ mitigationActive: active }),
    setIsCalculating: (val) => set({ isCalculating: val }),
    setCleanViewActive: (val) => set({ cleanViewActive: val }),
    setFocusedZoneId: (id) => set({ focusedZoneId: id }),
    setActionPlanVisible: (val) => set({ actionPlanVisible: val }),
    setFloodThreshold: (val) => set({ floodThreshold: val }),
    setHeatThreshold: (val) => set({ heatThreshold: val }),
    setDrainageEfficiency: (val) => set({ drainageEfficiency: val }),
    setSelectedCity: (city) => set({ selectedCity: city }),
    setCalibrationModeActive: (val) => set({ calibrationModeActive: val }),
    setAutoPilotActive: (val) => set({ autoPilotActive: val }),
    reset: () => set({
        rainfallIncrease: 0,
        tempIncrease: 0,
        viewMode: 'flood',
        timeStep: 0,
        mitigationActive: false,
        isCalculating: false,
        cleanViewActive: false,
        focusedZoneId: null,
        actionPlanVisible: false,
        floodThreshold: 0.85,
        heatThreshold: 0.85,
        drainageEfficiency: 0,
        selectedCity: 'BENGALURU',
        calibrationModeActive: false,
        autoPilotActive: false
    })
}));
