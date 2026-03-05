from backend_v2.risk_engine import UrbanRiskEngine
import json

try:
    engine = UrbanRiskEngine(model_path="backend_v2/models")
    test_inputs = {
        "rainfall_mm": 210,
        "avg_temperature_c": 45,
        "humidity_percent": 80,
        "drainage_capacity_index": 25,
        "green_cover_percent": 15,
        "population_density": 20000,
        "elevation_index": 10,
        "infrastructure_strength": 40,
        "emergency_response": 30
    }
    result = engine.calculate_risk(test_inputs)
    print(json.dumps(result, indent=2))
    
    # Test Sensitivity
    sensitivity = engine.analyze_sensitivity(test_inputs)
    print("\nSensitivity Analysis:")
    print(json.dumps(sensitivity, indent=2))
    
except Exception as e:
    import traceback
    traceback.print_exc()
