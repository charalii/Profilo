import re


def parse_cv_pdf(content: bytes) -> str:
    """Extract text from a PDF file using PyMuPDF."""
    import fitz  # PyMuPDF

    doc = fitz.open(stream=content, filetype="pdf")
    text_parts = []
    for page in doc:
        text_parts.append(page.get_text())
    doc.close()
    return "\n".join(text_parts)


def extract_profile_features(text: str) -> dict:
    """Extract profile features from CV text for matching."""
    text_lower = text.lower()

    legal_terms = ["legal", "law", "judicial", "regulatory", "compliance", "llm", "bar exam", "attorney"]
    defence_terms = ["defence", "defense", "military", "armed forces", "nato", "security", "csdp"]
    procurement_terms = ["procurement", "acquisition", "tender", "purchasing", "supply chain", "contract management"]
    policy_terms = ["policy", "governance", "legislative", "reform", "public administration"]
    eu_terms = ["european union", "eu ", "european commission", "european parliament", "european council", "eeas"]
    international_terms = ["international", "diplomatic", "multilateral", "un ", "united nations", "oecd"]

    has_legal = any(t in text_lower for t in legal_terms)
    has_defence = any(t in text_lower for t in defence_terms)
    has_procurement = any(t in text_lower for t in procurement_terms)
    has_policy = any(t in text_lower for t in policy_terms)
    has_eu = any(t in text_lower for t in eu_terms)
    has_international = any(t in text_lower for t in international_terms)

    # Years of experience
    years_experience = _extract_years(text_lower)

    # Education level
    education_level = "bachelor"
    if any(t in text_lower for t in ["phd", "doctorate", "ph.d"]):
        education_level = "phd"
    elif any(t in text_lower for t in ["master", "msc", "mba", "llm", "m.a.", "m.sc."]):
        education_level = "master"

    # CAST/EPSO
    has_cast = "cast" in text_lower or "contract agent selection tool" in text_lower
    has_epso = "epso" in text_lower or "european personnel selection office" in text_lower

    # Languages
    language_markers = ["english", "french", "german", "spanish", "italian", "dutch", "portuguese",
                        "polish", "greek", "romanian", "hungarian", "czech", "swedish", "danish",
                        "finnish", "bulgarian", "croatian", "slovak", "slovenian", "lithuanian",
                        "latvian", "estonian", "maltese", "irish"]
    language_count = sum(1 for lang in language_markers if lang in text_lower)
    has_c2 = bool(re.search(r'\bc2\b', text_lower))

    # Keywords
    all_terms = (legal_terms + defence_terms + procurement_terms + policy_terms + eu_terms +
                 international_terms + ["management", "project", "budget", "finance", "audit",
                                        "communication", "it", "cyber", "data", "digital"])
    keywords = [t for t in all_terms if t in text_lower]

    return {
        "has_legal": has_legal,
        "has_defence": has_defence,
        "has_procurement": has_procurement,
        "has_policy": has_policy,
        "has_eu": has_eu,
        "has_international": has_international,
        "years_experience": years_experience,
        "education_level": education_level,
        "has_cast": has_cast,
        "has_epso": has_epso,
        "language_count": max(1, language_count),
        "has_c2": has_c2,
        "keywords": keywords,
    }


def _extract_years(text: str) -> int:
    """Heuristic to extract years of experience from CV text."""
    patterns = [
        r'(\d+)\+?\s*years?\s*(?:of\s+)?(?:experience|work)',
        r'experience[:\s]*(\d+)\s*years?',
    ]
    max_years = 0
    for pattern in patterns:
        for match in re.finditer(pattern, text):
            years = int(match.group(1))
            if 0 < years < 50:
                max_years = max(max_years, years)
    return max_years
