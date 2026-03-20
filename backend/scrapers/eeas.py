from bs4 import BeautifulSoup
from playwright.async_api import async_playwright

from .base import BaseScraper


class EEASScraper(BaseScraper):
    async def fetch_listings(self) -> list[dict]:
        listings = []
        filters = [
            "f[0]=contract_type:Contract Agent",
            "f[0]=contract_type:Temporary Agent",
        ]

        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()

            for filter_param in filters:
                url = f"{self.config['base_url']}?{filter_param}"
                await page.goto(url, wait_until="networkidle", timeout=30000)
                html = await page.content()
                soup = BeautifulSoup(html, "html.parser")

                for card in soup.select("article a[href], .vacancy-item a[href], h3 a[href]"):
                    href = card.get("href", "")
                    if not href:
                        continue
                    if not href.startswith("http"):
                        href = f"https://www.eeas.europa.eu{href}"

                    try:
                        await page.goto(href, wait_until="networkidle", timeout=20000)
                        detail_html = await page.content()
                        detail = BeautifulSoup(detail_html, "html.parser")

                        title_el = detail.select_one("h1")
                        desc_el = detail.select_one(".field--name-body, .text, article")
                        desc_text = desc_el.get_text(separator=" ", strip=True)[:3000] if desc_el else ""

                        listings.append({
                            "title": title_el.get_text(strip=True) if title_el else "",
                            "organization": "EEAS",
                            "url": href,
                            "description": desc_text,
                            "contract_type": self._detect_contract_type(desc_text),
                            "deadline": self._find_deadline_text(detail),
                            "location": self._find_location(desc_text),
                        })
                    except Exception:
                        continue

            await browser.close()

        return [self.normalize(l) for l in listings if l.get("title")]

    def _find_deadline_text(self, soup: BeautifulSoup) -> str | None:
        for text in soup.stripped_strings:
            lower = text.lower()
            if "deadline" in lower or "closing date" in lower:
                return text
        return None
