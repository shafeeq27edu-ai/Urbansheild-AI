try:
    import sys
    import os
    # Add backend_v2 to path if needed, though uvicorn usually handles this if run from there
    sys.path.append(os.path.join(os.getcwd(), "backend_v2"))
    from risk_engine import UrbanRiskEngine
    print("Import successful!")
except Exception as e:
    import traceback
    traceback.print_exc()
