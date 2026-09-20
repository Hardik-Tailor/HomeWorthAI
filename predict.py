import sys
import joblib
import numpy as np
import json

try:
    model = joblib.load("Price_Estimator.pkl")

    area     = float(sys.argv[1])
    bedrooms = int(sys.argv[2])
    bathrooms= int(sys.argv[3])
    floors   = int(sys.argv[4])
    year     = int(sys.argv[5])
    tier     = int(sys.argv[6])

    # Model was trained with column order: BEDROOMS, BATHROOMS, SQUARE_FT, YEAR_BUILT, FLOORS, TIER
    features = np.array([[bedrooms, bathrooms, area, year, floors, tier]])
    price = model.predict(features)[0]

    print(json.dumps({"success": True, "price": round(float(price), 2)}))

except Exception as e:
    print(json.dumps({"success": False, "error": str(e)}))
