import random
import csv
import sys
import os

# ✅ Fix path FIRST
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

from models.user import UserInput
from utils.loader import load_schemes
from utils.matcher import is_eligible, score_scheme

schemes = load_schemes()

occupations = [
    "farmer", "self_employed", "salaried", "government_employee",
    "business", "student", "unemployed", "retired"
]

categories = ["General", "SC", "ST", "OBC", "EWS"]
genders = ["male", "female"]
disabilities = ["yes", "no"]

def generate_user():
    return {
        "age": random.randint(18, 70),
        "income": random.randint(0, 1000000),
        "occupation": random.choice(occupations),
        "gender": random.choice(genders),
        "state": "Maharashtra",
        "category": random.choice(categories),
        "disability": random.choice(disabilities)
    }

rows = []

NUM_SAMPLES = 3000

for _ in range(NUM_SAMPLES):
    user_dict = generate_user()
    user = UserInput(**user_dict)

    for scheme in schemes:   # ✅ VERY IMPORTANT LOOP

        eligible = is_eligible(user, scheme)

        if not eligible:
            # add few negative samples
            if random.random() > 0.1:
                continue
            label = 0
        else:
            score = score_scheme(user, scheme)
            label = 1 if score > 0 else 0

        # ✅ ALWAYS create row (for both cases)
        row = {
            **user_dict,
            "scheme_id": scheme["id"],
            "label": label
        }

        rows.append(row)

# ✅ Safety check (IMPORTANT)
if not rows:
    print("❌ No data generated")
    exit()

# 🔥 Save CSV
with open("ml_dataset.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)

print("✅ Dataset generated: ml_dataset.csv")