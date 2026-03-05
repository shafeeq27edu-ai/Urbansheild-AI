def calculate_statistical_confidence(inputs: dict, stats: dict, feature_names: list) -> str:
    """
    Z-score based Out-of-Distribution (OOD) detection.
    """
    extreme_features = 0
    for feature in feature_names:
        if feature not in stats: continue
        val = inputs.get(feature, 50)
        mean = stats[feature]["mean"]
        std = stats[feature]["std"]
        
        if std == 0: continue
        z_score = abs((val - mean) / std)

        if z_score > 2.0:  # 2 Sigma rule
            extreme_features += 1

    if extreme_features >= 3:
        return "Low"
    if extreme_features >= 1:
        return "Medium"
    return "High"
