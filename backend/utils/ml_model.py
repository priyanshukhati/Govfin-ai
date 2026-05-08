import pickle
import os
import pandas as pd

# 🔹 Load model and encoders once
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

model_path = os.path.join(BASE_DIR, "model.pkl")
encoders_path = os.path.join(BASE_DIR, "encoders.pkl")

with open(model_path, "rb") as f:
    model = pickle.load(f)

with open(encoders_path, "rb") as f:
    encoders = pickle.load(f)


def prepare_input(user, scheme):
    data = {
        "age": user.age,
        "income": user.income,
        "occupation": user.occupation,
        "gender": user.gender,
        "state": user.state.title(),
        "category": user.category.upper(),
        "disability": user.disability,
        "scheme_id": scheme["id"]
    }

    df = pd.DataFrame([data])

    # Encode categorical
    for col, encoder in encoders.items():
        try:
            df[col] = encoder.transform(df[col])
        except Exception:
            # fallback to first known class
            df[col] = encoder.transform([encoder.classes_[0]])[0]

    return df


def predict_score(user, scheme):
    try:
        df = prepare_input(user, scheme)

        # probability gives better ranking than 0/1
        proba = model.predict_proba(df)

        if len(proba[0]) > 1:
            score = proba[0][1]
        else:
            score = 0

        return score

    except Exception:
        return 0  # fallback safe