from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.deps import get_current_recruiter, get_db
from backend.api.models import Application, User, Vacancy
from backend.api.schemas import RecruiterAnalytics

router = APIRouter()


@router.get("/recruiter", response_model=RecruiterAnalytics)
async def recruiter_analytics(
    user: User = Depends(get_current_recruiter),
    db: AsyncSession = Depends(get_db),
):
    open_jobs = (
        await db.scalar(
            select(func.count(Vacancy.id)).where(
                Vacancy.posted_by_user_id == user.id,
                Vacancy.is_active == True,
            )
        )
        or 0
    )

    total_applications = (
        await db.scalar(
            select(func.count(Application.id))
            .select_from(Application)
            .join(Vacancy, Application.vacancy_id == Vacancy.id)
            .where(Vacancy.posted_by_user_id == user.id)
        )
        or 0
    )

    status_rows = await db.execute(
        select(Application.status, func.count(Application.id))
        .join(Vacancy, Application.vacancy_id == Vacancy.id)
        .where(Vacancy.posted_by_user_id == user.id)
        .group_by(Application.status)
    )
    by_status: dict[str, int] = {row[0]: row[1] for row in status_rows}

    cutoff = datetime.utcnow() - timedelta(days=7)
    applications_last_7_days = (
        await db.scalar(
            select(func.count(Application.id))
            .select_from(Application)
            .join(Vacancy, Application.vacancy_id == Vacancy.id)
            .where(
                Vacancy.posted_by_user_id == user.id,
                Application.updated_at >= cutoff,
            )
        )
        or 0
    )

    return RecruiterAnalytics(
        open_jobs=open_jobs,
        total_applications=total_applications,
        by_status=by_status,
        applications_last_7_days=applications_last_7_days,
    )
