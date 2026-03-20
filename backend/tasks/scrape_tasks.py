import asyncio
import logging

from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert as pg_insert

from backend.api.deps import async_session
from backend.api.models import Vacancy
from backend.scrapers.eeas import EEASScraper
from backend.scrapers.eda import EDAScraper
from backend.scrapers.nato import NATOScraper
from backend.scrapers.nspa import NSPAScraper
from backend.scrapers.eurobrussels import EuroBrusselsScraper
from backend.scrapers.registry import get_scraper_config
from backend.tasks.celery_app import celery_app

logger = logging.getLogger(__name__)

SCRAPER_CLASSES = {
    "eeas": EEASScraper,
    "eda": EDAScraper,
    "nato_is": NATOScraper,
    "nspa": NSPAScraper,
    "eurobrussels": EuroBrusselsScraper,
}


async def _run_scraper(source_id: str) -> int:
    config = get_scraper_config(source_id)
    if not config:
        raise ValueError(f"Unknown source: {source_id}")

    scraper_cls = SCRAPER_CLASSES.get(source_id)
    if not scraper_cls:
        raise ValueError(f"No scraper implemented for: {source_id}")

    scraper = scraper_cls(source_id, config)
    listings = await scraper.fetch_listings()

    async with async_session() as db:
        for item in listings:
            stmt = pg_insert(Vacancy).values(**item)
            stmt = stmt.on_conflict_do_update(
                constraint="uq_vacancy_source_external",
                set_={
                    "title": stmt.excluded.title,
                    "description": stmt.excluded.description,
                    "deadline": stmt.excluded.deadline,
                    "is_active": True,
                    "last_checked": stmt.excluded.scraped_at,
                },
            )
            await db.execute(stmt)
        await db.commit()

    logger.info("Scraped %d listings from %s", len(listings), source_id)
    return len(listings)


@celery_app.task(name="scrape")
def scrape(source_id: str) -> int:
    return asyncio.run(_run_scraper(source_id))


@celery_app.task(name="deactivate_expired")
def deactivate_expired() -> int:
    async def _deactivate():
        from datetime import date
        async with async_session() as db:
            result = await db.execute(
                select(Vacancy).where(Vacancy.is_active == True, Vacancy.deadline < date.today())
            )
            expired = result.scalars().all()
            for v in expired:
                v.is_active = False
            await db.commit()
            return len(expired)
    return asyncio.run(_deactivate())


@celery_app.task(name="recompute_all_matches")
def recompute_all_matches() -> str:
    # Triggers match recomputation for all users
    # In production, this would iterate users and call compute_matches
    return "Match recomputation triggered"


@celery_app.task(name="send_alerts")
def send_alerts(frequency: str) -> int:
    async def _send():
        from backend.services.email_alerts import send_alerts_for_frequency
        async with async_session() as db:
            return await send_alerts_for_frequency(frequency, db)
    return asyncio.run(_send())
