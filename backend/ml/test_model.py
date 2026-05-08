import pickle
import os
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Load model
with open(os.path.join(BASE_DIR, "model.pkl"), "rb") as f:
    model = pickle.load(f)

# Load encoders
with open(os.path.join(BASE_DIR, "encoders.pkl"), "rb") as f:
    encoders = pickle.load(f)

# Sample input (same as your system)
data = {
    "age": 25,
    "income": 200000,
    "occupation": "student",
    "gender": "male",
    "state": "Maharashtra",
    "category": "General",
    "disability": "no",
    "scheme_id": 1
}

df = pd.DataFrame([data])

# Encode categorical values
for col, encoder in encoders.items():
    df[col] = encoder.transform(df[col])

# Predict
prediction = model.predict(df)

print("Prediction:", prediction)