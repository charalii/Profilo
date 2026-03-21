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
from backend.scrapers.eu_careers import EUCareersScraper
from backend.scrapers.euiss import EUISScraper
from backend.scrapers.frontex import FrontexScraper
from backend.scrapers.euspa import EUSPAScraper
from backend.scrapers.registry import get_scraper_config
from backend.tasks.celery_app import celery_app

logger = logging.getLogger(__name__)

SCRAPER_CLASSES = {
    "eeas": EEASScraper,
    "eda": EDAScraper,
    "nato_is": NATOScraper,
    "nspa": NSPAScraper,
    "eurobrussels": EuroBrusselsScraper,
    "eu_careers": EUCareersScraper,
    "euiss": EUISScraper,
    "frontex": FrontexScraper,
    "euspa": EUSPAScraper,
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
    from backend.api.models import CVProfile, Match
    from backend.services.matching import ProfileFeatures, compute_match

    async def _recompute():
        async with async_session() as db:
            # Get all CV profiles
            cv_result = await db.execute(select(CVProfile))
            profiles = cv_result.scalars().all()

            # Get all active vacancies
            vac_result = await db.execute(
                select(Vacancy).where(Vacancy.is_active == True)
            )
            vacancies = vac_result.scalars().all()

            count = 0
            for cv in profiles:
                pf = ProfileFeatures(
                    has_legal=cv.has_legal,
                    has_defence=cv.has_defence,
                    has_procurement=cv.has_procurement,
                    has_policy=cv.has_policy,
                    has_eu=cv.has_eu,
                    has_international=cv.has_international,
                    years_exp=cv.years_experience,
                    education_level=cv.education_level or "bachelor",
                    has_cast=cv.has_cast,
                    has_epso=cv.has_epso,
                    language_count=cv.language_count,
                    has_c2=cv.has_c2,
                    keywords={k.lower() for k in (cv.keywords or [])},
                )
                for vac in vacancies:
                    result = compute_match(pf, vac.keywords or [])

                    stmt = pg_insert(Match).values(
                        user_id=cv.user_id,
                        cv_profile_id=cv.id,
                        vacancy_id=vac.id,
                        match_score=result["score"],
                        matched_keywords=result["matched_keywords"],
                        missing_keywords=result["missing_keywords"],
                    )
                    stmt = stmt.on_conflict_do_update(
                        constraint="uq_match_cv_vacancy",
                        set_={
                            "match_score": stmt.excluded.match_score,
                            "matched_keywords": stmt.excluded.matched_keywords,
                            "missing_keywords": stmt.excluded.missing_keywords,
                        },
                    )
                    await db.execute(stmt)
                    count += 1

            await db.commit()
            return count

    total = asyncio.run(_recompute())
    logger.info("Recomputed %d matches", total)
    return f"Recomputed {total} matches"


@celery_app.task(name="send_alerts")
def send_alerts(frequency: str) -> int:
    async def _send():
        from backend.services.email_alerts import send_alerts_for_frequency
        async with async_session() as db:
            return await send_alerts_for_frequency(frequency, db)
    return asyncio.run(_send())


@celery_app.task(name="notify_application_status")
def notify_application_status(
    to_email: str,
    candidate_name: str | None,
    job_title: str,
    organization: str,
    old_status: str,
    new_status: str,
) -> None:
    from backend.services.email_alerts import notify_application_status_change

    asyncio.run(
        notify_application_status_change(
            to_email=to_email,
            candidate_name=candidate_name,
            job_title=job_title,
            organization=organization,
            old_status=old_status,
            new_status=new_status,
        )
    )
