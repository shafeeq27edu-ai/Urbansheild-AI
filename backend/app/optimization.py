import pandas as pd

def run_resource_optimization_engine(inputs: dict, flood_risk: float, heat_risk: float, risk_engine) -> dict:
    """Multi-action efficiency comparison"""
    # Action A: Drainage Upgrade (Cost: 10M)
    inputs_a = inputs.copy()
    inputs_a["drainage_capacity_index"] = min(
        100, inputs.get("drainage_capacity_index", 50) + 20
    )
    
    # Use cached model from risk_engine
    df_a = pd.DataFrame([inputs_a])[risk_engine.feature_names]
    risk_a = risk_engine.flood_model.predict(df_a.values)[0]
    
    reduction_a = flood_risk - risk_a
    efficiency_a = reduction_a / 10.0  # Risk reduction per Million

    # Action B: Green Cover Increase (Cost: 5M)
    inputs_b = inputs.copy()
    inputs_b["green_cover_percent"] = min(
        60, inputs.get("green_cover_percent", 20) + 15
    )
    
    df_b = pd.DataFrame([inputs_b])[risk_engine.feature_names]
    risk_b = risk_engine.heat_model.predict(df_b.values)[0]
    
    reduction_b = heat_risk - risk_b
    efficiency_b = reduction_b / 5.0
    
    if efficiency_a > efficiency_b:
        return {
            "optimal_action": "Major Drainage Expansion",
            "efficiency_score": round(float(efficiency_a), 2),
            "estimated_cost": "₹10M",
            "impact": "High Hydrological Relief",
        }
    else:
        return {
            "optimal_action": "Urban Reforestation & Green Roofs",
            "efficiency_score": round(float(efficiency_b), 2),
            "estimated_cost": "₹5M",
            "impact": "Thermal Mitigation & Resilience",
        }
