import numpy as np
import pandas as pd
from xgboost import XGBRegressor
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import joblib
import pickle
import os

# Configuration
os.makedirs("backend/models", exist_ok=True)
MODEL_STORAGE = "backend/models"

def generate_synthetic_data(n_samples=5000):
    """
    Generates realistic synthetic data distributions derived from Indian historical weather ranges.
    """
    np.random.seed(42)
    
    data = {
        # Rainfall: 0 - 300 mm (Skewed right)
        'rainfall_mm': np.random.beta(1.5, 5, n_samples) * 300,
        # Temperature: 18 - 48 C (Slightly right skewed)
        'avg_temperature_c': 18 + (np.random.beta(2, 2.5, n_samples) * 30),
        # Humidity: 20 - 100 %
        'humidity_percent': np.random.uniform(20, 100, n_samples),
        # Drainage: 10 - 70 %
        'drainage_capacity_index': np.random.uniform(10, 70, n_samples),
        # Green cover: 5 - 60 %
        'green_cover_percent': np.random.uniform(5, 60, n_samples),
        # Population density: 500 - 25000
        'population_density': np.random.uniform(500, 25000, n_samples),
        # Elevation: 0 - 100
        'elevation_index': np.random.uniform(0, 100, n_samples)
    }
    
    df = pd.DataFrame(data)
    
    # Target: Flood Risk (0-100) directly scaled
    # Rainfall pressure relative to drainage
    flood_pressure = df['rainfall_mm'] / (df['drainage_capacity_index'] / 100)
    df['flood_risk'] = (flood_pressure * 0.4) + ((100 - df['elevation_index']) * 0.2)
    df['flood_risk'] = df['flood_risk'].clip(0, 100) + np.random.normal(0, 2, n_samples)
    df['flood_risk'] = df['flood_risk'].clip(0, 100)
    
    # Target: Heat Risk (0-100) directly scaled
    temp_penalty = np.maximum((df['avg_temperature_c'] - 30) * 3, 0)
    humidity_penalty = df['humidity_percent'] * 0.2
    pop_penalty = df['population_density'] * 0.002
    df['heat_risk'] = temp_penalty + humidity_penalty + pop_penalty
    df['heat_risk'] = df['heat_risk'].clip(0, 100) + np.random.normal(0, 2, n_samples)
    df['heat_risk'] = df['heat_risk'].clip(0, 100)
    
    return df

def train_models():
    print("Generating synthetic climate data...")
    df = generate_synthetic_data()
    
    features = [
        'rainfall_mm', 'avg_temperature_c', 'humidity_percent', 
        'drainage_capacity_index', 'green_cover_percent', 
        'population_density', 'elevation_index'
    ]
    
    stats = {
        feature: {
            'mean': float(df[feature].mean()),
            'std': float(df[feature].std()),
            'min': float(df[feature].min()),
            'max': float(df[feature].max())
        } for feature in features
    }
    
    baselines = {
        'rainfall_mm': 85.0,
        'avg_temperature_c': 32.0,
        'humidity_percent': 60.0
    }
    
    # Train Flood Model (XGBoost) using specific inference features
    print("Training Flood XGBoost Model...")
    flood_features = ['rainfall_mm', 'drainage_capacity_index', 'humidity_percent']
    X_f = df[flood_features]
    y_f = df['flood_risk']
    
    flood_model = XGBRegressor(n_estimators=300, max_depth=5, learning_rate=0.05, subsample=0.8, random_state=42)
    flood_model.fit(X_f, y_f)
    
    f_pred = flood_model.predict(X_f)
    flood_r2 = r2_score(y_f, f_pred)
    flood_rmse = mean_squared_error(y_f, f_pred) ** 0.5
    print(f"Flood R2: {flood_r2:.4f}, RMSE: {flood_rmse:.4f}")
    
    # Train Heat Model (XGBoost) using specific inference features
    print("Training Heat XGBoost Model...")
    heat_features = ['avg_temperature_c', 'humidity_percent']
    X_h = df[heat_features]
    y_h = df['heat_risk']
    
    heat_model = XGBRegressor(n_estimators=300, max_depth=5, learning_rate=0.05, subsample=0.8, random_state=42)
    heat_model.fit(X_h, y_h)
    
    h_pred = heat_model.predict(X_h)
    heat_r2 = r2_score(y_h, h_pred)
    heat_rmse = mean_squared_error(y_h, h_pred) ** 0.5
    print(f"Heat R2: {heat_r2:.4f}, RMSE: {heat_rmse:.4f}")
    
    model_accuracy = {
        "flood_r2": round(float(flood_r2), 2),
        "heat_r2": round(float(heat_r2), 2),
        "flood_rmse": round(float(flood_rmse), 2),
        "heat_rmse": round(float(heat_rmse), 2)
    }
    
    # Save Models and Metadata
    joblib.dump(flood_model, f"{MODEL_STORAGE}/flood_model.pkl")
    joblib.dump(heat_model, f"{MODEL_STORAGE}/heat_model.pkl")
    with open(f"{MODEL_STORAGE}/features.pkl", "wb") as f:
        pickle.dump(features, f)
    with open(f"{MODEL_STORAGE}/stats.pkl", "wb") as f:
        pickle.dump(stats, f)
    with open(f"{MODEL_STORAGE}/baselines.pkl", "wb") as f:
        pickle.dump(baselines, f)
    with open(f"{MODEL_STORAGE}/accuracy.pkl", "wb") as f:
        pickle.dump(model_accuracy, f)
        
    print(f"XGBoost Models & Stats saved to {MODEL_STORAGE}/")

if __name__ == "__main__":
    train_models()
