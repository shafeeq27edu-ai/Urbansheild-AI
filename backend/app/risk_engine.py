import pickle
import numpy as np
import pandas as pd
import os
from typing import Dict, Any

from .config import settings
from .calibration import get_adaptive_flood_score, get_adaptive_heat_score
from .resilience import calculate_collapse_probability, calculate_socioeconomic_vulnerability, estimate_population_exposure
from .optimization import run_resource_optimization_engine
from .confidence import calculate_statistical_confidence

class UrbanRiskEngine:
    def __init__(self, model_path=None):
        self.model_path = model_path or settings.MODEL_DIR
        self.flood_model = self._load_model("flood_model.pkl")
        self.heat_model = self._load_model("heat_model.pkl")
        self.feature_names = self._load_model("features.pkl")
        self.stats = self._load_model("stats.pkl")
        self.baselines = self._load_model("baselines.pkl")
        self.is_loaded = True

    def _load_model(self, filename):
        path = os.path.join(self.model_path, filename)
        if not os.path.exists(path):
            raise FileNotFoundError(f"Model file {filename} not found at {path}")
        with open(path, "rb") as f:
            return pickle.load(f)

    def calculate_risk(self, inputs: dict) -> Dict[str, Any]:
        """
        Orchestrates the full risk intelligence pipeline.
        """
        # 1. Prepare Features
        df_input = pd.DataFrame([inputs])
        X = df_input[self.feature_names]

        # 2. ML Predictions (Ensemble Mean)
        ml_flood_preds = np.array([tree.predict(X.values)[0] for tree in self.flood_model.estimators_])
        ml_heat_preds = np.array([tree.predict(X.values)[0] for tree in self.heat_model.estimators_])

        ml_flood = float(ml_flood_preds.mean())
        ml_heat = float(ml_heat_preds.mean())
        
        uncertainty_flood = float(ml_flood_preds.std())
        uncertainty_heat = float(ml_heat_preds.std())
        combined_uncertainty = (uncertainty_flood + uncertainty_heat) / 2

        # 3. Adaptive Calibration (Domain Logic)
        domain_flood = get_adaptive_flood_score(inputs, self.baselines, self.stats)
        domain_heat = get_adaptive_heat_score(inputs)

        # 4. Hybrid Scoring
        final_flood = (0.5 * ml_flood) + (0.5 * domain_flood)
        final_heat = (0.5 * ml_heat) + (0.5 * domain_heat)

        # 5. Infrastructure Impact
        collapse_prob = calculate_collapse_probability(inputs)
        if collapse_prob > 0.6:
            final_flood += 15  # Cascading failure impact

        final_flood = float(np.clip(final_flood, 0, 100))
        final_heat = float(np.clip(final_heat, 0, 100))

        # 6. Compound Cascade
        precip = inputs.get("rainfall_mm", 0)
        temp = inputs.get("avg_temperature_c", 30)
        interaction_term = (precip * temp) / 2500
        compound_risk = (0.55 * final_flood) + (0.35 * final_heat) + (0.1 * interaction_term * 10)

        if final_flood > 65 and final_heat > 65:
            compound_risk += 12  # Synergy penalty
        compound_risk = float(np.clip(compound_risk, 0, 100))

        # 7. Vulnerability & Exposure
        vulnerability_factor = calculate_socioeconomic_vulnerability(inputs)
        humanitarian_risk = float(np.clip(compound_risk * vulnerability_factor, 0, 100))
        exposed_pop = estimate_population_exposure(inputs, humanitarian_risk)

        # 8. Confidence & Optimization
        confidence = calculate_statistical_confidence(inputs, self.stats, self.feature_names)
        optimization = run_resource_optimization_engine(inputs, final_flood, final_heat, self)

        # 9. Category Assignment
        risk_category = "Low"
        if humanitarian_risk > 85: risk_category = "Critical"
        elif humanitarian_risk > 65: risk_category = "High"
        elif humanitarian_risk > 35: risk_category = "Moderate"

        # 10. Intelligence Report
        intelligence_report = self._generate_report(inputs, final_flood, final_heat, humanitarian_risk, collapse_prob)

        return {
            "flood_risk_index": round(final_flood, 2),
            "heat_risk_index": round(final_heat, 2),
            "compound_risk_index": round(compound_risk, 2),
            "humanitarian_impact_index": round(humanitarian_risk, 2),
            "risk_category": risk_category,
            "infrastructure_collapse_prob": round(collapse_prob, 3),
            "uncertainty_band": f"±{round(combined_uncertainty, 1)}",
            "estimated_population_exposed": int(exposed_pop),
            "model_confidence": confidence,
            "optimization_insight": optimization,
            "intelligence_report": intelligence_report,
            "top_drivers": self._get_top_drivers()
        }

    def _generate_report(self, inputs, flood, heat, compound, collapse) -> str:
        insights = []
        if inputs.get("rainfall_mm", 0) > 150: insights.append("Extreme precipitation anomaly detected.")
        if collapse > 0.7: insights.append("CRITICAL: Drainage infrastructure failure likely.")
        if heat > 75: insights.append("Extreme thermal stress detected.")
        if not insights: insights.append("Urban systems performing within stable operational parameters.")
        return " ".join(insights)

    def _get_top_drivers(self):
        importances = self.flood_model.feature_importances_
        indices = np.argsort(importances)[::-1][:3]
        return [self.feature_names[i] for i in indices]
