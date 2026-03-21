from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.deps import get_current_recruiter, get_db
from backend.api.models import CVProfile, User
from backend.api.schemas import CandidateSearchItem, CandidateSearchResponse

router = APIRouter()


@router.get("/search", response_model=CandidateSearchResponse)
async def search_candidates(
    q: str | None = Query(None, description="Search name, email, or CV text"),
    min_years: int | None = Query(None, ge=0, le=50),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    _recruiter: User = Depends(get_current_recruiter),
    db: AsyncSession = Depends(get_db),
):
    base_filters = [User.role == "candidate"]
    if min_years is not None:
        base_filters.append(CVProfile.years_experience >= min_years)
    if q:
        term = f"%{q.strip()}%"
        base_filters.append(
            or_(
                User.email.ilike(term),
                User.name.ilike(term),
                CVProfile.raw_text.ilike(term),
            )
        )

    count_q = (
        select(func.count(CVProfile.id))
        .select_from(CVProfile)
        .join(User, CVProfile.user_id == User.id)
        .where(*base_filters)
    )
    total = (await db.scalar(count_q)) or 0

    data_q = (
        select(CVProfile, User)
        .join(User, CVProfile.user_id == User.id)
        .where(*base_filters)
        .order_by(CVProfile.updated_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
    )
    result = await db.execute(data_q)
    rows = result.all()

    items: list[CandidateSearchItem] = []
    for profile, u in rows:
        items.append(
            CandidateSearchItem(
                user_id=u.id,
                name=u.name,
                email=u.email,
                cv_profile_id=profile.id,
                years_experience=profile.years_experience,
                education_level=profile.education_level,
                keywords=list(profile.keywords or []),
                updated_at=profile.updated_at,
            )
        )

    return CandidateSearchResponse(items=items, total=total)
