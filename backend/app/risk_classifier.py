def classify_risk(score: float) -> str:
    """Standard risk labeling logic."""
    if score < 30:
        return "Low"
    elif score < 60:
        return "Moderate"
    elif score < 80:
        return "High"
    else:
        return "Critical"

def calculate_risk_velocity(current_score: float, previous_score: float = None) -> str:
    """Measures delta in risk intensity."""
    if previous_score is None:
        return "1.0x"
    # Simulated velocity based on score delta
    velocity = 1.0 + (current_score - previous_score) / 100
    return f"{max(0.1, round(velocity, 2))}x"

def project_escalation(score: float) -> str:
    """Projected worsening in the next 6 hours."""
    # Simple deterministic multiplier for demo purposes
    escalation = score * 0.15 if score > 50 else score * 0.05
    return f"+{round(escalation, 1)}%"
