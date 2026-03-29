"""
Scraper health check — run before deploying to verify all sources respond.

Usage:
    python -m backend.scripts.check_scrapers
    python -m backend.scripts.check_scrapers --source eda
"""
import asyncio
import argparse
import sys
import httpx
from datetime import datetime

SOURCES = {
    "eda":          "https://vacancies.eda.europa.eu/",
    "eu_careers":   "https://eu-careers.europa.eu/en/job-opportunities",
    "eurobrussels": "https://www.eurobrussels.com/job_search",
    "euiss":        "https://www.iss.europa.eu/about-us/opportunities",
    "frontex":      "https://www.frontex.europa.eu/careers/vacancies/",
    "euspa":        "https://www.euspa.europa.eu/about/careers",
    "nspa":         "https://nspa-nato.career.emply.com/vacancies",
    # JS-rendered (Playwright) — just check HTTP reachability
    "eeas":         "https://www.eeas.europa.eu/eeas/vacancies_en",
    "nato_is":      "https://nato.taleo.net/careersection/2/jobsearch.ftl",
}

GREEN  = "\033[92m"
RED    = "\033[91m"
YELLOW = "\033[93m"
RESET  = "\033[0m"


async def check(source: str, url: str) -> dict:
    try:
        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
            t0 = datetime.utcnow()
            r = await client.get(url, headers={"User-Agent": "Mozilla/5.0"})
            ms = int((datetime.utcnow() - t0).total_seconds() * 1000)
            ok = r.status_code < 400
            return {"source": source, "ok": ok, "status": r.status_code, "ms": ms}
    except Exception as e:
        return {"source": source, "ok": False, "status": 0, "ms": 0, "error": str(e)[:60]}


async def main(only: str | None = None):
    sources = {k: v for k, v in SOURCES.items() if not only or k == only}

    print(f"\n{'─'*55}")
    print(f"  Profilo Scraper Health Check — {datetime.utcnow().strftime('%Y-%m-%d %H:%M')} UTC")
    print(f"{'─'*55}")

    tasks = [check(src, url) for src, url in sources.items()]
    results = await asyncio.gather(*tasks)

    failed = 0
    for r in results:
        icon = f"{GREEN}✓{RESET}" if r["ok"] else f"{RED}✗{RESET}"
        status = r.get("status", 0)
        ms = r.get("ms", 0)
        err = f"  {YELLOW}{r.get('error', '')}{RESET}" if not r["ok"] else ""
        print(f"  {icon}  {r['source']:<16} HTTP {status}   {ms}ms{err}")
        if not r["ok"]:
            failed += 1

    print(f"{'─'*55}")
    total = len(results)
    print(f"  {total - failed}/{total} sources reachable\n")

    if failed:
        sys.exit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", help="Check a single source")
    args = parser.parse_args()
    asyncio.run(main(only=args.source))
