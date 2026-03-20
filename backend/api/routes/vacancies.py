from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.deps import get_db
from backend.api.models import Vacancy
from backend.api.schemas import VacancyListResponse, VacancyResponse

router = APIRouter()


@router.get("", response_model=VacancyListResponse)
async def list_vacancies(
    source: str | None = Query(None, description="Comma-separated sources"),
    contract_type: str | None = Query(None, alias="type"),
    location: str | None = None,
    sort: str = Query("deadline", regex="^(deadline|scraped_at)$"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    query = select(Vacancy).where(Vacancy.is_active == True)

    if source:
        sources = [s.strip() for s in source.split(",")]
        query = query.where(Vacancy.source.in_(sources))

    if contract_type:
        types = [t.strip() for t in contract_type.split(",")]
        query = query.where(Vacancy.contract_type.in_(types))

    if location:
        query = query.where(Vacancy.location.ilike(f"%{location}%"))

    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar() or 0

    if sort == "deadline":
        query = query.order_by(Vacancy.deadline.asc().nullslast())
    else:
        query = query.order_by(Vacancy.scraped_at.desc())

    query = query.offset((page - 1) * limit).limit(limit)
    result = await db.execute(query)
    items = result.scalars().all()

    return VacancyListResponse(items=items, total=total, page=page, limit=limit)


@router.get("/{vacancy_id}", response_model=VacancyResponse)
async def get_vacancy(vacancy_id: UUID, db: AsyncSession = Depends(get_db)):
    vacancy = await db.get(Vacancy, vacancy_id)
    if not vacancy:
        raise HTTPException(status_code=404, detail="Vacancy not found")
    return vacancy
