import httpx
from bs4 import BeautifulSoup

from .base import BaseScraper


class EuroBrusselsScraper(BaseScraper):
    async def fetch_listings(self) -> list[dict]:
        listings = []

        async with httpx.AsyncClient(timeout=30, follow_redirects=True) as client:
            resp = await client.get(self.config["base_url"])
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, "html.parser")

            for link in soup.select("a[href*='/job/']"):
                href = link.get("href", "")
                title = link.get_text(strip=True)
                if not href or not title:
                    continue
                if not href.startswith("http"):
                    href = f"https://www.eurobrussels.com{href}"

                try:
                    detail_resp = await client.get(href)
                    detail_resp.raise_for_status()
                    detail = BeautifulSoup(detail_resp.text, "html.parser")
                    body = detail.select_one(".job-description, main, article")
                    desc = body.get_text(separator=" ", strip=True)[:3000] if body else ""
                except Exception:
                    desc = ""

                listings.append({
                    "title": title,
                    "organization": self._extract_org(detail) if desc else "Unknown",
                    "url": href,
                    "description": desc,
                    "contract_type": self._detect_contract_type(desc),
                    "location": self._find_location(desc) or "Brussels",
                })

        return [self.normalize(l) for l in listings if l.get("title")]

    def _extract_org(self, soup: BeautifulSoup) -> str:
        org_el = soup.select_one(".company-name, .employer")
        return org_el.get_text(strip=True) if org_el else "Unknown"
