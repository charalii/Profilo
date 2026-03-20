import httpx
from bs4 import BeautifulSoup

from .base import BaseScraper


class NSPAScraper(BaseScraper):
    async def fetch_listings(self) -> list[dict]:
        listings = []

        async with httpx.AsyncClient(timeout=30, follow_redirects=True) as client:
            resp = await client.get(self.config["base_url"])
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, "html.parser")

            for card in soup.select("a.vacancy-card, .vacancy-list a, a[href*='vacanc']"):
                href = card.get("href", "")
                title = card.get_text(strip=True)
                if not href or not title:
                    continue
                if not href.startswith("http"):
                    href = f"https://nspa-nato.career.emply.com{href}"

                try:
                    detail_resp = await client.get(href)
                    detail_resp.raise_for_status()
                    detail = BeautifulSoup(detail_resp.text, "html.parser")
                    body = detail.select_one("main, .content, article")
                    desc = body.get_text(separator=" ", strip=True)[:3000] if body else ""
                except Exception:
                    desc = ""

                listings.append({
                    "title": title,
                    "organization": "NATO NSPA",
                    "url": href,
                    "description": desc,
                    "contract_type": self._detect_contract_type(desc),
                    "location": self._find_location(desc) or "Luxembourg",
                })

        return [self.normalize(l) for l in listings if l.get("title")]
