"""
Development-only helpers: demo JWT, manual scrapes. Disabled unless PROFILO_DEV=1.
"""

import os

from fastapi import APIRouter, Depends, HTTPException, status
from passlib.context import CryptContext
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.deps import create_access_token, get_db
from backend.api.models import User
from backend.api.schemas import TokenResponse
from backend.scrapers.registry import SCRAPERS
from backend.tasks.scrape_tasks import SCRAPER_CLASSES, _run_scraper

PROFILO_DEV = os.getenv("PROFILO_DEV", "").lower() in ("1", "true", "yes")

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

DEV_EMAIL = {
    "candidate": "dev+candidate@profilo.local",
    "recruiter": "dev+recruiter@profilo.local",
}


def _require_dev() -> None:
    if not PROFILO_DEV:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")


class DevTokenRequest(BaseModel):
    role: str = Field(default="candidate", pattern="^(candidate|recruiter)$")


@router.get("/status")
async def dev_status():
    _require_dev()
    return {
        "profilo_dev": True,
        "message": "Dev endpoints enabled. Do not enable PROFILO_DEV in production.",
    }


@router.post("/token", response_model=TokenResponse)
async def dev_token(
    data: DevTokenRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Issue a JWT for a stable demo user (created on first use).
    """
    _require_dev()
    email = DEV_EMAIL[data.role]
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user:
        user = User(
            email=email,
            name="Dev Candidate" if data.role == "candidate" else "Dev Recruiter",
            hashed_password=pwd_context.hash("devpass123"),
            role=data.role,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    elif user.role != data.role:
        user.role = data.role
        await db.commit()
        await db.refresh(user)

    return TokenResponse(access_token=create_access_token(user.id))


@router.get("/scrapers")
async def list_scrapers():
    _require_dev()
    items = []
    for sid, meta in SCRAPERS.items():
        items.append(
            {
                "id": sid,
                "name": meta.get("name", sid),
                "base_url": meta.get("base_url"),
                "method": meta.get("method"),
                "implemented": sid in SCRAPER_CLASSES,
            }
        )
    return {"scrapers": items}


@router.post("/scrape/{source_id}")
async def run_scrape(source_id: str):
    """
    Run one scraper synchronously (same logic as Celery task `scrape`).
    Requires network access from the API process.
    """
    _require_dev()
    if source_id not in SCRAPER_CLASSES:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown or unimplemented source: {source_id}. "
            f"Implemented: {sorted(SCRAPER_CLASSES.keys())}",
        )
    try:
        count = await _run_scraper(source_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    return {"source": source_id, "listings_processed": count}
