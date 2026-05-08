def is_eligible(user, scheme):
    if not scheme.get("eligibility"):
        return False

    e = scheme["eligibility"]

    # user.state.lower()

    if not (e["min_age"] <= user.age <= e["max_age"]):
        return False

    if user.income > e["max_income"]:
        return False

    if user.occupation not in e["occupation"] and "all" not in e["occupation"]:
        return False

    if user.state not in e["state"] and "all" not in e["state"]:
        return False

    if user.category not in e["category"] and "all" not in e["category"]:
        return False

    if user.gender not in e["gender"]:
        return False

    if user.disability not in e["disability"]:
        return False

    return True

def score_scheme(user, scheme):
    if not scheme.get("eligibility"):
        return 0
    
    score = 0
    e = scheme["eligibility"]

    # user_state = user.state.lower()

    if user.income <= e["max_income"]:
        score += 2

    if user.occupation in e["occupation"] or "all" in e["occupation"]:
        score += 2

    if user.category in e["category"] or "all" in e["category"]:
        score += 2

    if user.state in e["state"] or "all" in e["state"]:
        score += 1

    if user.gender in e["gender"]:
        score += 1

    if user.disability in e["disability"]:
        score += 1

    return score