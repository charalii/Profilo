from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.api.deps import get_current_user, get_db
from backend.api.models import CVProfile, Match, User, Vacancy
from backend.api.schemas import MatchListResponse, MatchResponse
from backend.services.matching import ProfileFeatures, compute_match

router = APIRouter()

FREE_TIER_WEEKLY_LIMIT = 3


async def _check_free_tier(user: User, db: AsyncSession) -> None:
    """Raise 402 if free user has already seen 3 matches this week."""
    if user.plan != "free":
        return

    now = datetime.utcnow()
    week_start = (now - timedelta(days=now.weekday())).replace(
        hour=0, minute=0, second=0, microsecond=0
    )

    result = await db.execute(
        select(func.count()).where(
            Match.user_id == user.id,
            Match.created_at >= week_start,
        )
    )
    weekly_used = result.scalar() or 0

    if weekly_used >= FREE_TIER_WEEKLY_LIMIT:
        raise HTTPException(
            status_code=402,
            detail={
                "error": "free_tier_limit_reached",
                "message": f"Free plan includes {FREE_TIER_WEEKLY_LIMIT} matches per week. "
                           "Upgrade to Pro for unlimited matches.",
                "weekly_used": weekly_used,
                "limit": FREE_TIER_WEEKLY_LIMIT,
                "upgrade_url": "/pricing",
            },
        )


@router.post("/compute", status_code=200)
async def compute_matches(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _check_free_tier(user, db)

    result = await db.execute(
        select(CVProfile).where(CVProfile.user_id == user.id).order_by(CVProfile.created_at.desc())
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=400, detail="Upload a CV first")

    features = ProfileFeatures(
        has_legal=profile.has_legal,
        has_defence=profile.has_defence,
        has_procurement=profile.has_procurement,
        has_policy=profile.has_policy,
        has_eu=profile.has_eu,
        has_international=profile.has_international,
        years_exp=profile.years_experience,
        education_level=profile.education_level or "bachelor",
        has_cast=profile.has_cast,
        has_epso=profile.has_epso,
        language_count=profile.language_count,
        has_c2=profile.has_c2,
        keywords=set(profile.keywords or []),
    )

    vacancies_result = await db.execute(select(Vacancy).where(Vacancy.is_active == True))
    vacancies = vacancies_result.scalars().all()

    created = 0
    for vacancy in vacancies:
        match_result = compute_match(features, vacancy.keywords or [])

        existing = await db.execute(
            select(Match).where(Match.cv_profile_id == profile.id, Match.vacancy_id == vacancy.id)
        )
        match_obj = existing.scalar_one_or_none()

        if match_obj:
            match_obj.match_score = match_result["score"]
            match_obj.matched_keywords = match_result["matched_keywords"]
            match_obj.missing_keywords = match_result["missing_keywords"]
        else:
            match_obj = Match(
                user_id=user.id,
                cv_profile_id=profile.id,
                vacancy_id=vacancy.id,
                match_score=match_result["score"],
                matched_keywords=match_result["matched_keywords"],
                missing_keywords=match_result["missing_keywords"],
            )
            db.add(match_obj)
            created += 1

    await db.commit()
    return {"message": f"Computed matches for {len(vacancies)} vacancies", "new_matches": created}


@router.get("/results", response_model=MatchListResponse)
async def get_match_results(
    min_score: int = Query(0, ge=0, le=99),
    sort: str = Query("score", regex="^(score|deadline)$"),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(Match)
        .options(selectinload(Match.vacancy))
        .where(Match.user_id == user.id, Match.match_score >= min_score)
    )

    if sort == "score":
        query = query.order_by(Match.match_score.desc())
    else:
        query = query.join(Vacancy).order_by(Vacancy.deadline.asc().nullslast())

    result = await db.execute(query)
    items = result.scalars().all()

    return MatchListResponse(items=items, total=len(items))
