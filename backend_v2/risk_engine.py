import pickle
import numpy as np
import pandas as pd
import os


class UrbanRiskEngine:
    def __init__(self, model_path=None):
        if model_path is None:
            # Default to the 'models' directory in the same folder as this script
            self.model_path = os.path.join(os.path.dirname(__file__), "models")
        else:
            self.model_path = model_path

        self.flood_model = self._load_model("flood_model.pkl")
        self.heat_model = self._load_model("heat_model.pkl")
        self.feature_names = self._load_model("features.pkl")
        self.stats = self._load_model("stats.pkl")
        self.baselines = self._load_model("baselines.pkl")

    def _load_model(self, filename):
        path = os.path.join(self.model_path, filename)
        if not os.path.exists(path):
            raise FileNotFoundError(f"Model file {filename} not found at {path}")
        with open(path, "rb") as f:
            return pickle.load(f)

    def calculate_risk(self, inputs: dict):
        """
        Calculates Deep Risk Intelligence (ML + Adaptive Calibration + Impact Analysis).
        """
        # Prepare features for ML prediction
        df_input = pd.DataFrame([inputs])
        X = df_input[self.feature_names]

        # 1. ML Predictions & Uncertainty (Upgrade 14)
        ml_flood_preds = np.array(
            [tree.predict(X.values)[0] for tree in self.flood_model.estimators_]
        )
        ml_heat_preds = np.array(
            [tree.predict(X.values)[0] for tree in self.heat_model.estimators_]
        )

        ml_flood = ml_flood_preds.mean()
        ml_heat = ml_heat_preds.mean()

        uncertainty_flood = ml_flood_preds.std()
        uncertainty_heat = ml_heat_preds.std()
        combined_uncertainty = (uncertainty_flood + uncertainty_heat) / 2

        # 2. Upgrade 8: Dynamic Threshold Adaptation (Climate Drift Awareness)
        # Compare rainfall relative to seasonal mean (Anomaly detection)
        precip = inputs.get("rainfall_mm", 0)
        seasonal_mean = self.baselines.get("rainfall_mm", 85)
        seasonal_std = self.stats.get("rainfall_mm", {}).get("std", 87)
        rainfall_anomaly = (precip - seasonal_mean) / seasonal_std

        # 3. Upgrade 9: Infrastructure Collapse Probability
        collapse_prob = self._calculate_collapse_probability(inputs)

        # 4. Adaptive Scaling (Continuous penalties)
        domain_flood = self._get_adaptive_flood_score(inputs, rainfall_anomaly)
        domain_heat = self._get_adaptive_heat_score(inputs)

        # 5. Hybrid Final Scores
        final_flood = (0.5 * ml_flood) + (0.5 * domain_flood)
        final_heat = (0.5 * ml_heat) + (0.5 * domain_heat)

        # Apply Structural Penalty from Collapse (Upgrade 9)
        if collapse_prob > 0.6:
            final_flood += 15  # Cascading failure impact

        final_flood = float(np.clip(final_flood, 0, 100))
        final_heat = float(np.clip(final_heat, 0, 100))

        # 6. Compound Cascade & Upgrade 15: Stress Interaction Matrix
        interaction_term = (precip * inputs.get("avg_temperature_c", 30)) / 2500
        compound_risk = (
            (0.55 * final_flood) + (0.35 * final_heat) + (0.1 * interaction_term * 10)
        )

        if final_flood > 65 and final_heat > 65:
            compound_risk += 12  # Higher synergy penalty
        compound_risk = float(np.clip(compound_risk, 0, 100))

        # 7. Upgrade 12: Socioeconomic Risk Weighting
        vulnerability_factor = self._calculate_socioeconomic_vulnerability(inputs)
        humanitarian_risk = compound_risk * vulnerability_factor
        humanitarian_risk = float(np.clip(humanitarian_risk, 0, 100))

        # 8. Upgrade 10: Risk Velocity Metric
        risk_velocity = self._calculate_risk_velocity(inputs, compound_risk)

        # 9. Temporal Stress Projection
        forward_escalation = self._project_temporal_stress(inputs, compound_risk)

        # 10. Exposure Impact
        exposed_pop = self._estimate_population_exposure(inputs, humanitarian_risk)

        # 11. Distribution-Based Confidence
        confidence = self._calculate_statistical_confidence(inputs)

        # 12. Optimization Engine (Upgrade 11)
        optimization = self._run_resource_optimization_engine(
            inputs, final_flood, final_heat
        )

        risk_category = "Low"
        if humanitarian_risk > 85:
            risk_category = "Critical"
        elif humanitarian_risk > 65:
            risk_category = "High"
        elif humanitarian_risk > 35:
            risk_category = "Moderate"

        # 13. Upgrade 13: Explainable Narrative Generator
        intelligence_report = self._generate_intelligence_report(
            inputs,
            final_flood,
            final_heat,
            humanitarian_risk,
            rainfall_anomaly,
            collapse_prob,
            risk_velocity,
        )

        return {
            "flood_risk_index": round(final_flood, 2),
            "heat_risk_index": round(final_heat, 2),
            "compound_risk_index": round(compound_risk, 2),
            "humanitarian_impact_index": round(humanitarian_risk, 2),
            "risk_category": risk_category,
            "temporal_escalation_6h": f"+{round(forward_escalation, 1)}%",
            "risk_velocity": f"{round(risk_velocity, 2)}x",
            "infrastructure_collapse_prob": round(collapse_prob, 3),
            "uncertainty_band": f"±{round(combined_uncertainty, 1)}",
            "estimated_population_exposed": int(exposed_pop),
            "model_confidence": confidence,
            "optimization_insight": optimization,
            "intelligence_report": intelligence_report,
            "top_drivers": self._get_top_drivers(self.flood_model),
        }

    def _calculate_collapse_probability(self, inputs):
        """Upgrade 9: Probabilistic collapse risk sigmoid model"""
        precip = inputs.get("rainfall_mm", 0)
        drainage = inputs.get("drainage_capacity_index", 50)
        # Assume soil saturation correlates with rainfall for this simulation
        soil_saturation = min(100, (precip / 200) * 80)

        z = (0.03 * precip) + (0.05 * soil_saturation) - (0.04 * drainage) - 2.0
        return 1 / (1 + np.exp(-z))

    def _calculate_socioeconomic_vulnerability(self, inputs):
        """Upgrade 12: Vulnerability multiplier based on demographics"""
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

    def _calculate_risk_velocity(self, inputs, current_risk):
        """Upgrade 10: Risk Acceleration Index"""
        # Calculate risk at slightly higher rainfall to find derivative
        test_inputs = inputs.copy()
        test_inputs["rainfall_mm"] += 10

        # Mini-inference
        df_test = pd.DataFrame([test_inputs])
        X_test = df_test[self.feature_names]
        f_risk = self.flood_model.predict(X_test)[0]
        h_risk = self.heat_model.predict(X_test)[0]

        future_risk = (0.6 * f_risk) + (0.4 * h_risk)
        delta_risk = future_risk - current_risk
        return max(0, delta_risk / 10)

    def _run_resource_optimization_engine(self, inputs, flood_risk, heat_risk):
        """Upgrade 11: Multi-action efficiency comparison"""
        # Action A: Drainage Upgrade (Cost: 10M)
        inputs_a = inputs.copy()
        inputs_a["drainage_capacity_index"] = min(
            100, inputs.get("drainage_capacity_index", 50) + 20
        )
        risk_a = self.flood_model.predict(pd.DataFrame([inputs_a])[self.feature_names])[
            0
        ]
        reduction_a = flood_risk - risk_a
        efficiency_a = reduction_a / 10.0  # Risk reduction per Million

        # Action B: Green Cover Increase (Cost: 5M)
        inputs_b = inputs.copy()
        inputs_b["green_cover_percent"] = min(
            60, inputs.get("green_cover_percent", 20) + 15
        )
        risk_b = self.heat_model.predict(pd.DataFrame([inputs_b])[self.feature_names])[
            0
        ]
        reduction_b = heat_risk - risk_b
        efficiency_b = reduction_b / 5.0

        if efficiency_a > efficiency_b:
            return {
                "optimal_action": "Major Drainage Expansion",
                "efficiency_score": round(efficiency_a, 2),
                "estimated_cost": "₹10M",
                "impact": "High Hydrological Relief",
            }
        else:
            return {
                "optimal_action": "Urban Reforestation & Green Roofs",
                "efficiency_score": round(efficiency_b, 2),
                "estimated_cost": "₹5M",
                "impact": "Thermal Mitigation & Resilience",
            }

    def _generate_intelligence_report(
        self, inputs, flood, heat, compound, anomaly, collapse, velocity
    ):
        """Upgrade 13: Template-based explainable narrative"""
        insights = []

        if anomaly > 2.0:
            insights.append(
                "Rainfall levels are critically above seasonal norms (Extreme Anomaly)."
            )
        elif anomaly > 1.0:
            insights.append(
                "Precipitation is trending significantly higher than historical averages."
            )

        if collapse > 0.7:
            insights.append(
                "CRITICAL: Drainage infrastructure is likely to fail under current hydraulic load."
            )
        elif collapse > 0.4:
            insights.append(
                "Warning: Infrastructure stress detected; drainage efficiency declining."
            )

        if velocity > 0.5:
            insights.append(
                "Risk levels are accelerating rapidly; immediate intervention recommended."
            )

        if heat > 75:
            insights.append(
                "Extreme thermal stress detected; potential for urban heat island amplification."
            )

        if not insights:
            insights.append(
                "Urban systems performing within stable operational parameters."
            )

        return " ".join(insights)

    def _get_adaptive_flood_score(self, inputs, rainfall_anomaly=0):
        """
        Continuous penalty functions for realistic risk growth.
        """
        precip = inputs.get("rainfall_mm", 0)
        drainage = inputs.get("drainage_capacity_index", 50)
        elev = inputs.get("elevation_index", 50)

        # Adaptive scaling influenced by anomaly (Upgrade 8)
        anomaly_penalty = max(0, rainfall_anomaly * 12)
        rainfall_penalty = min(max(0, (precip - 120) * 0.15), 25)
        drainage_penalty = (100 - drainage) * 0.2
        elevation_penalty = (100 - elev) * 0.1

        base = (precip / 300) * 40
        return min(
            100,
            base
            + rainfall_penalty
            + drainage_penalty
            + elevation_penalty
            + anomaly_penalty,
        )

    def _get_adaptive_heat_score(self, inputs):
        temp = inputs.get("avg_temperature_c", 30)
        green = inputs.get("green_cover_percent", 20)
        humidity = inputs.get("humidity_percent", 50)

        temp_penalty = min(max(0, (temp - 38) * 2.0), 30)
        green_penalty = (60 - green) * 0.25
        humidity_penalty = max(0, (humidity - 70) * 0.5)

        base = ((temp - 15) / 35) * 45
        return min(100, base + temp_penalty + green_penalty + humidity_penalty)

    def _project_temporal_stress(self, inputs, current_risk):
        """
        Deterministic short-term forward projection based on stress vectors.
        """
        precip = inputs.get("rainfall_mm", 0)
        temp = inputs.get("avg_temperature_c", 30)

        stress_trend = 0
        if precip > 180:
            stress_trend += 0.08  # Escalation if heavy rain continues
        if temp > 42:
            stress_trend += 0.05  # Thermal stress accumulation

        return stress_trend * 100

    def _estimate_population_exposure(self, inputs, risk_index):
        pop_density = inputs.get("population_density", 5000)
        vulnerability_factor = 1.2  # Weight for urban density
        return pop_density * (risk_index / 100) * vulnerability_factor

    def _calculate_statistical_confidence(self, inputs):
        """
        Z-score based Out-of-Distribution (OOD) detection.
        """
        extreme_features = 0
        for feature in self.feature_names:
            val = inputs.get(feature, 50)
            mean = self.stats[feature]["mean"]
            std = self.stats[feature]["std"]
            z_score = abs((val - mean) / std)

            if z_score > 2.0:  # 2 Sigma rule
                extreme_features += 1

        if extreme_features >= 3:
            return "Low"
        if extreme_features >= 1:
            return "Medium"
        return "High"

    def analyze_sensitivity(self, inputs: dict):
        """
        Upgrade 5: Sensitivity Analysis Endpoint.
        Measures how much each feature affects the final compound risk.
        """
        base_result = self.calculate_risk(inputs)
        base_risk = base_result["compound_risk_index"]

        sensitivities = {}
        for feature in self.feature_names:
            perturbed_inputs = inputs.copy()
            # Increase feature by 10% of its range or significant delta
            delta = self.stats[feature]["std"] * 0.5
            perturbed_inputs[feature] += delta

            p_result = self.calculate_risk(perturbed_inputs)
            risk_delta = p_result["compound_risk_index"] - base_risk
            sensitivities[f"{feature}_sensitivity"] = round(risk_delta, 2)

        return sensitivities

    def _get_top_drivers(self, model):
        importances = model.feature_importances_
        indices = np.argsort(importances)[::-1][:3]
        return [self.feature_names[i] for i in indices]
