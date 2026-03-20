import hashlib
import re
from abc import ABC, abstractmethod
from datetime import datetime

from dateutil import parser as date_parser


class BaseScraper(ABC):
    def __init__(self, source_id: str, config: dict):
        self.source_id = source_id
        self.config = config

    @abstractmethod
    async def fetch_listings(self) -> list[dict]:
        """Return list of raw vacancy dicts."""
        pass

    def normalize(self, raw: dict) -> dict:
        """Normalize to standard vacancy schema."""
        return {
            "source": self.source_id,
            "external_id": raw.get("id") or self._hash(raw["url"]),
            "title": raw["title"].strip(),
            "organization": raw["organization"],
            "location": raw.get("location", ""),
            "contract_type": raw.get("contract_type", ""),
            "deadline": self._parse_date(raw.get("deadline")),
            "description": raw.get("description", ""),
            "url": raw["url"],
            "keywords": self._extract_keywords(raw.get("description", "")),
            "is_active": True,
            "scraped_at": datetime.utcnow(),
        }

    def _hash(self, url: str) -> str:
        return hashlib.md5(url.encode()).hexdigest()[:16]

    def _extract_keywords(self, text: str) -> list[str]:
        """Extract domain-relevant keywords from text."""
        keyword_patterns = [
            "legal", "law", "judicial", "regulatory", "compliance", "legislative",
            "defence", "defense", "military", "nato", "security", "csdp",
            "procurement", "contract", "acquisition", "tender", "purchasing",
            "policy", "governance", "reform", "drafting",
            "eu", "european", "commission", "council", "parliament", "eeas",
            "international", "diplomatic", "multilateral",
            "management", "project", "budget", "finance", "audit",
            "communication", "public affairs", "media",
            "human resources", "hr", "recruitment",
            "it", "cyber", "data", "digital", "technology",
        ]
        text_lower = text.lower()
        return list({kw for kw in keyword_patterns if kw in text_lower})

    def _parse_date(self, date_str) -> datetime | None:
        if not date_str:
            return None
        if isinstance(date_str, datetime):
            return date_str
        try:
            return date_parser.parse(str(date_str))
        except (ValueError, TypeError):
            return None

    def _detect_contract_type(self, text: str) -> str:
        text_lower = text.lower()
        type_map = {
            "contract agent": "contract_agent",
            "temporary agent": "temporary_agent",
            "fgiv": "contract_agent_fgiv",
            "fgiii": "contract_agent_fgiii",
            "seconded national expert": "sne",
            "traineeship": "traineeship",
            "internship": "traineeship",
            "nato civilian": "nato_civilian",
        }
        for pattern, contract_type in type_map.items():
            if pattern in text_lower:
                return contract_type
        return ""

    def _find_location(self, text: str) -> str:
        locations = ["brussels", "strasbourg", "luxembourg", "the hague", "mons", "naples",
                      "paris", "rome", "vienna", "madrid", "berlin", "warsaw"]
        text_lower = text.lower() if isinstance(text, str) else ""
        for loc in locations:
            if loc in text_lower:
                return loc.title()
        return ""
