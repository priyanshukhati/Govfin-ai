import pandas as pd
import pickle
import os

from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier

# 🔹 Load dataset
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data_path = os.path.join(BASE_DIR, "ml_dataset.csv")

df = pd.read_csv(data_path)

if df.empty:
    print("❌ Dataset is empty")
    exit()  

# 🔹 Features and target
X = df.drop("label", axis=1)
y = df["label"]

# 🔹 Encode categorical columns
encoders = {}

categorical_cols = ["occupation", "gender", "state", "category", "disability"]

for col in categorical_cols:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col])
    encoders[col] = le

# 🔹 Encode scheme_id
le_scheme = LabelEncoder()
X["scheme_id"] = le_scheme.fit_transform(X["scheme_id"])
encoders["scheme_id"] = le_scheme    

# 🔹 Train model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X, y)

model_path = os.path.join(BASE_DIR, "model.pkl")
encoders_path = os.path.join(BASE_DIR, "encoders.pkl")

with open(model_path, "wb") as f:
    pickle.dump(model, f)

with open(encoders_path, "wb") as f:
    pickle.dump(encoders, f)  

print("✅ Model trained and saved successfully")