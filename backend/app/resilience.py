import numpy as np

def calculate_collapse_probability(inputs: dict) -> float:
    """Probabilistic collapse risk sigmoid model"""
    precip = inputs.get("rainfall_mm", 0)
    drainage = inputs.get("drainage_capacity_index", 50)
    # Assume soil saturation correlates with rainfall for this simulation
    soil_saturation = min(100, (precip / 200) * 80)

    z = (0.03 * precip) + (0.05 * soil_saturation) - (0.04 * drainage) - 2.0
    return float(1 / (1 + np.exp(-z)))

def calculate_socioeconomic_vulnerability(inputs: dict) -> float:
    """Vulnerability multiplier based on demographics"""
    pop_density = inputs.get("population_density", 5000)
    # Simulated factors if not in inputs
    slum_ratio = inputs.get("slum_ratio", 0.15 if pop_density > 15000 else 0.05)
    elderly_ratio = inputs.get("elderly_population_high", 0.1)

    v_factor = 1.0
    if pop_density > 18000:
        v_factor += 0.2
    if slum_ratio > 0.2:
        v_factor += 0.1
    if elderly_ratio > 0.15:
        v_factor += 0.3

    return v_factor

def estimate_population_exposure(inputs: dict, risk_index: float) -> int:
    pop_density = inputs.get("population_density", 5000)
    vulnerability_factor = 1.2  # Weight for urban density
    return int(pop_density * (risk_index / 100) * vulnerability_factor)
