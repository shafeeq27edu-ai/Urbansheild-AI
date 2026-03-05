import time
import logging
from datetime import datetime
from typing import Any, Dict
from .config import settings

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("server_log.txt"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("UrbanShield")

def create_standard_response(data: Dict[str, Any], confidence: str, start_time: float) -> Dict[str, Any]:
    processing_time = (time.time() - start_time) * 1000
    
    return {
        "status": "success",
        "data": data,
        "metadata": {
            "model_version": settings.MODEL_VERSION,
            "api_version": settings.API_VERSION,
            "timestamp": datetime.now().isoformat(),
            "confidence": confidence,
            "processing_time_ms": round(processing_time, 2)
        }
    }

def log_inference(inputs: Dict[str, Any], results: Dict[str, Any]):
    logger.info(f"INFERENCE | Inputs: {inputs} | Result: {results.get('compound_risk_index')} | Category: {results.get('risk_category')}")
