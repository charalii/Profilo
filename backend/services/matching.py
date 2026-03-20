from dataclasses import dataclass, field


@dataclass
class ProfileFeatures:
    has_legal: bool = False
    has_defence: bool = False
    has_procurement: bool = False
    has_policy: bool = False
    has_eu: bool = False
    has_international: bool = False
    years_exp: int = 0
    education_level: str = "bachelor"
    has_cast: bool = False
    has_epso: bool = False
    language_count: int = 1
    has_c2: bool = False
    keywords: set = field(default_factory=set)


WEIGHTS = {
    "keyword_overlap": 0.30,
    "domain_fit": 0.25,
    "qualification": 0.20,
    "experience": 0.15,
    "language": 0.10,
}

BOOSTS = {
    ("has_legal", "has_defence"): 0.08,
    ("has_procurement", "has_eu"): 0.06,
    ("has_policy", "has_defence"): 0.07,
    ("has_cast",): 0.05,
    ("has_epso",): 0.03,
}

DOMAIN_MAP = {
    "legal": ["legal", "law", "judicial", "regulatory", "compliance", "legislative"],
    "defence": ["defence", "defense", "military", "nato", "security", "csdp"],
    "procurement": ["procurement", "contract", "acquisition", "tender", "purchasing"],
    "policy": ["policy", "legislative", "drafting", "governance", "reform"],
    "eu": ["eu", "european", "commission", "council", "parliament", "eeas"],
}


def compute_match(profile: ProfileFeatures, vacancy_keywords: list[str]) -> dict:
    vk = {k.lower() for k in vacancy_keywords}
    pk = profile.keywords or set()

    # 1. Keyword overlap
    overlap = vk & pk
    kw_score = len(overlap) / max(len(vk), 1)

    # 2. Domain fit
    domain_scores = []
    for domain, terms in DOMAIN_MAP.items():
        if any(t in vk for t in terms):
            attr = f"has_{domain}"
            domain_scores.append(1.0 if getattr(profile, attr, False) else 0.0)
    domain_score = sum(domain_scores) / len(domain_scores) if domain_scores else 0.5

    # 3. Qualification
    edu_map = {"bachelor": 0.3, "master": 0.6, "phd": 0.8}
    qual_score = edu_map.get(profile.education_level, 0.3)
    qual_score += 0.15 if profile.has_cast else 0
    qual_score += 0.05 if profile.has_epso else 0
    qual_score = min(1.0, qual_score)

    # 4. Experience
    exp_score = min(1.0, profile.years_exp / 10)

    # 5. Language
    lang_score = (0.5 if profile.has_c2 else 0.2) + min(0.5, profile.language_count * 0.125)

    # Weighted sum
    raw = (
        WEIGHTS["keyword_overlap"] * kw_score
        + WEIGHTS["domain_fit"] * domain_score
        + WEIGHTS["qualification"] * qual_score
        + WEIGHTS["experience"] * exp_score
        + WEIGHTS["language"] * lang_score
    )

    # Boost factors
    boost = 0
    for combo, value in BOOSTS.items():
        if all(getattr(profile, attr, False) for attr in combo):
            boost += value

    final_score = min(99, round((raw + boost) * 100))

    return {
        "score": final_score,
        "matched_keywords": list(overlap),
        "missing_keywords": list(vk - pk),
        "breakdown": {
            "keyword_overlap": round(kw_score * 100),
            "domain_fit": round(domain_score * 100),
            "qualification": round(qual_score * 100),
            "experience": round(exp_score * 100),
            "language": round(lang_score * 100),
        },
    }
