import pandas as pd
import pickle
import os
import matplotlib.pyplot as plt

from sklearn.metrics import roc_curve, auc
from sklearn.model_selection import train_test_split

# -----------------------------
# Paths
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

data_path = os.path.join(BASE_DIR, "ml_dataset.csv")
model_path = os.path.join(BASE_DIR, "model.pkl")
encoder_path = os.path.join(BASE_DIR, "encoders.pkl")

# -----------------------------
# Load Dataset
# -----------------------------
df = pd.read_csv(data_path)

X = df.drop("label", axis=1)
y = df["label"]

# -----------------------------
# Load Encoders
# -----------------------------
with open(encoder_path, "rb") as f:
    encoders = pickle.load(f)

# Encode same as training
for col in encoders:
    X[col] = encoders[col].transform(X[col])

# -----------------------------
# Split Test Data
# -----------------------------
_, X_test, _, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# -----------------------------
# Load Existing Model
# -----------------------------
with open(model_path, "rb") as f:
    model = pickle.load(f)

# -----------------------------
# Predict Probabilities
# -----------------------------
y_prob = model.predict_proba(X_test)[:, 1]

# -----------------------------
# ROC Calculation
# -----------------------------
fpr, tpr, thresholds = roc_curve(y_test, y_prob)
roc_auc = auc(fpr, tpr)

# -----------------------------
# Plot ROC Curve
# -----------------------------
plt.figure(figsize=(8,6))
plt.plot(fpr, tpr, linewidth=2, label=f"AUC = {roc_auc:.2f}")
plt.plot([0,1], [0,1], linestyle="--")

plt.xlabel("False Positive Rate")
plt.ylabel("True Positive Rate")
plt.title("ROC Curve - GovFin AI")
plt.legend(loc="lower right")
plt.grid(True)

# Save image
save_path = os.path.join(BASE_DIR, "roc_curve.png")
plt.savefig(save_path, dpi=300)

plt.show()

print("AUC Score:", round(roc_auc, 4))
print("ROC curve saved as roc_curve.png")