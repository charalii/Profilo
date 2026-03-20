from bs4 import BeautifulSoup
from playwright.async_api import async_playwright

from .base import BaseScraper


class NATOScraper(BaseScraper):
    async def fetch_listings(self) -> list[dict]:
        listings = []

        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()

            await page.goto(self.config["base_url"], wait_until="networkidle", timeout=30000)
            await page.wait_for_selector("table, .job-list, .listSingleContainer", timeout=10000)

            html = await page.content()
            soup = BeautifulSoup(html, "html.parser")

            for row in soup.select("tr a[href], .listSingleContainer a[href]"):
                href = row.get("href", "")
                title = row.get_text(strip=True)
                if not href or not title:
                    continue
                if not href.startswith("http"):
                    href = f"https://nato.taleo.net{href}"

                try:
                    await page.goto(href, wait_until="networkidle", timeout=20000)
                    detail_html = await page.content()
                    detail = BeautifulSoup(detail_html, "html.parser")
                    body = detail.select_one(".jobDisplay, .job-description, main")
                    desc = body.get_text(separator=" ", strip=True)[:3000] if body else ""
                except Exception:
                    desc = ""

                listings.append({
                    "title": title,
                    "organization": "NATO International Staff",
                    "url": href,
                    "description": desc,
                    "contract_type": self._detect_contract_type(desc),
                    "location": self._find_location(desc) or "Brussels",
                })

            await browser.close()

        return [self.normalize(l) for l in listings if l.get("title")]
