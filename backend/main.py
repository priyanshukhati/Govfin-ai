from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models.user import UserInput
from utils.loader import load_schemes
from utils.matcher import is_eligible, score_scheme

from utils.ml_model import predict_score

app = FastAPI()

# ✅ CORS (VERY IMPORTANT for frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

schemes = load_schemes()


@app.get("/")
def home():
    return {"message": "GovFin AI Backend Running"}


def is_relevant(user, scheme):
    category = scheme["category_type"].lower()

    # 🎯 Student → only financial/education
    if user.occupation == "student":
        return category in ["financial aid", "education"]

    # 🎯 Farmer → only agriculture
    if user.occupation == "farmer":
        return category == "agriculture"

    # 🎯 Business → only business
    if user.occupation == "business":
        return category in ["business", "financial aid"]

    # 🎯 Senior citizen
    if user.age >= 60:
        return category in ["savings", "healthcare"]

    # 🎯 Disability
    if user.disability == "yes":
        return (
            "yes" in scheme["eligibility"]["disability"]
            or category in ["healthcare", "financial aid"]
        )

    # 🎯 Default
    return True


@app.post("/predict")
def predict(user: UserInput):

    # ✅ Normalize user input (VERY IMPORTANT)
    user.state = user.state.lower()
    user.occupation = user.occupation.lower()
    user.gender = user.gender.lower()
    user.disability = user.disability.lower()
    user.category = user.category.lower()
    
    matched = []

    for scheme in schemes:
        # 🔴 NEW FILTER
        if not is_relevant(user, scheme):
            continue
        
        eligible_flag = is_eligible(user, scheme)

        if eligible_flag:
            rule_score = score_scheme(user, scheme)
        else:
            rule_score = 0

        # 🔥 ML score
        ml_score = predict_score(user, scheme) or 0

        # 🔥 Combine (ML priority)
        priority_boost = 0

        if eligible_flag:
           priority_boost += 0.2

        # # ❌ Reduce business schemes for non-business users
        # if user.occupation != "business" and scheme["category_type"].lower() == "business":
        #     priority_boost -= 0.4
        
        # # ❌ Reduce pension for young users
        # if user.age < 50 and scheme["category_type"].lower() == "savings":
        #     priority_boost -= 0.3

        # # ❌ Reduce irrelevant categories
        # if user.occupation == "student" and scheme["category_type"].lower() == "business":
        #     priority_boost -= 0.3

        # 🎯 Student priority
        if user.occupation == "student" and scheme["category_type"].lower() == "financial aid":
            priority_boost += 0.3
        
        # 🎯 Disability priority
        if user.disability == "yes" and "yes" in scheme["eligibility"]["disability"]:
            priority_boost += 1.2
        
        # 🎯 Farmer priority
        if user.occupation == "farmer" and scheme["category_type"].lower() == "agriculture":
            priority_boost += 0.4
        # ❌ Penalize overly generic schemes (like Ayushman)
        if scheme["name"] == "Ayushman Bharat":
            priority_boost -= 0.2    
        
        # final_score = (0.6 * ml_score) + (0.3 * rule_score) + priority_boost
        
        final_score = (0.55 * ml_score) + (0.35 * rule_score) + priority_boost

        final_score = max(final_score, 0)

        matched.append((scheme, final_score))

    if not matched:
       # fallback (NEW)
       return {
           "best_scheme": schemes[0],
           "recommended": schemes[1:5]
       }

    # 🔥 Sort by score
    matched.sort(key=lambda x: x[1], reverse=True)

    best_scheme = matched[0][0]
    recommended = [s[0] for s in matched[1:6]]

    return {
        "best_scheme": best_scheme,
        "recommended": recommended
    }

@app.get("/scheme/{scheme_id}")
def get_scheme(scheme_id: int):
    for scheme in schemes:
        if scheme["id"] == scheme_id:
            return scheme

    return {"error": "Scheme not found"}

@app.get("/search")
def search_schemes(q: str):
    q = q.lower().strip()
    words = q.split()

    results = []

    for scheme in schemes:
        name = scheme["name"].lower()
        category = scheme["category_type"].lower()
        description = scheme["description"].lower()

        if (
            any(word in name for word in words)
            or q in category
            or q in description
        ):
            results.append(scheme)

    return {"results": results}

@app.get("/filter")
def filter_schemes(category: str):
    category = category.lower()

    results = []

    for scheme in schemes:
        if scheme["category_type"].lower() == category:
            results.append(scheme)

    return {"results": results}