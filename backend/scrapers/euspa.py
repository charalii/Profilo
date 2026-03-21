import httpx
from bs4 import BeautifulSoup

from .base import BaseScraper


class EUSPAScraper(BaseScraper):
    """Scraper for EU Agency for the Space Programme vacancies."""

    async def fetch_listings(self) -> list[dict]:
        listings = []

        async with httpx.AsyncClient(timeout=30, follow_redirects=True) as client:
            resp = await client.get(self.config["base_url"])
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, "html.parser")

            selectors = [
                "a[href*='career']",
                "a[href*='vacanc']",
                ".view-content a",
                ".views-row a",
                "a[href*='job']",
                "article a",
            ]

            seen_urls = set()
            for selector in selectors:
                for link in soup.select(selector):
                    href = link.get("href", "")
                    if not href:
                        continue
                    if not href.startswith("http"):
                        href = f"https://www.euspa.europa.eu{href}"
                    if href in seen_urls:
                        continue
                    seen_urls.add(href)

                    title = link.get_text(strip=True)
                    if not title or len(title) < 5:
                        continue

                    desc = ""
                    try:
                        detail_resp = await client.get(href)
                        detail_resp.raise_for_status()
                        detail = BeautifulSoup(detail_resp.text, "html.parser")
                        body = detail.select_one("main, .content, article")
                        desc = (
                            body.get_text(separator=" ", strip=True)[:3000]
                            if body
                            else ""
                        )
                    except Exception:
                        pass

                    listings.append(
                        {
                            "title": title,
                            "organization": "EU Agency for the Space Programme",
                            "url": href,
                            "description": desc,
                            "contract_type": self._detect_contract_type(desc),
                            "location": self._find_location(desc) or "Prague",
                        }
                    )

        return [self.normalize(l) for l in listings if l.get("title")]
