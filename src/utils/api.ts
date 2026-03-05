/**
 * UrbanShield API Utility
 * Centralized handler for backend communication with Deep Intelligence engine.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export interface SimulationInputs {
  rainfall_mm: number;
  avg_temperature_c: number;
  humidity_percent: number;
  drainage_capacity_index: number;
  green_cover_percent: number;
  population_density: number;
  elevation_index: number;
  infrastructure_strength: number;
  emergency_response: number;
}

export interface AnalyzeCityPayload {
  city: string;
  overrides?: Partial<SimulationInputs>;
}

/**
 * Phase 3: Live City Analysis
 * Fetches real-time weather and city-specific infrastructure data.
 */
export const analyzeCity = async (payload: AnalyzeCityPayload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze-city`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.detail || "City analysis failed");
    }
    return await response.json();
  } catch (error) {
    console.error("AnalyzeCity API Error:", error);
    throw error;
  }
}

/**
 * Manual Stress Test Simulation
 */
export const simulateRisk = async (inputs: SimulationInputs) => {
  try {
    const response = await fetch(`${API_BASE_URL}/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputs),
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.detail || "Backend simulation failed");
    }
    return await response.json();
  } catch (error) {
    console.error("Simulation API Error:", error);
    throw error;
  }
};

/**
 * Compatibility Export for legacy calls
 */
export const predictRisk = simulateRisk;

export const analyzeSensitivity = async (inputs: SimulationInputs) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sensitivity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputs),
    });
    if (!response.ok) throw new Error("Sensitivity analysis failed");
    return await response.json();
  } catch (error) {
    console.error("Sensitivity API Error:", error);
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    return { status: "offline" };
  }
};
