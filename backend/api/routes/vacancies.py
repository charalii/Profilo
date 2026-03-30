from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.deps import get_current_recruiter, get_current_user_optional, get_db
from backend.api.models import User, Vacancy
from backend.api.schemas import VacancyCreate, VacancyListResponse, VacancyResponse, VacancyUpdate

router = APIRouter()


@router.get("", response_model=VacancyListResponse)
async def list_vacancies(
    source: str | None = Query(None, description="Comma-separated sources"),
    contract_type: str | None = Query(None, alias="type"),
    location: str | None = None,
    q: str | None = Query(None, description="Search title, organization, description"),
    organization: str | None = Query(None, description="Filter by organization (partial)"),
    mine: bool = Query(False, description="Recruiter: only jobs you posted"),
    sort: str = Query("deadline", pattern="^(deadline|scraped_at)$"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_current_user_optional),
):
    if mine:
        if not user or user.role != "recruiter":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Recruiter authentication required for mine=true",
            )

    query = select(Vacancy).where(Vacancy.is_active == True)

    if source:
        sources = [s.strip() for s in source.split(",")]
        query = query.where(Vacancy.source.in_(sources))

    if contract_type:
        types = [t.strip() for t in contract_type.split(",")]
        query = query.where(Vacancy.contract_type.in_(types))

    if location:
        query = query.where(Vacancy.location.ilike(f"%{location}%"))

    if organization:
        query = query.where(Vacancy.organization.ilike(f"%{organization}%"))

    if q:
        term = f"%{q.strip()}%"
        query = query.where(
            or_(
                Vacancy.title.ilike(term),
                Vacancy.organization.ilike(term),
                Vacancy.description.ilike(term),
            )
        )

    if mine and user and user.role == "recruiter":
        query = query.where(Vacancy.posted_by_user_id == user.id)

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


@router.post("", response_model=VacancyResponse, status_code=201)
async def create_vacancy(
    data: VacancyCreate,
    user: User = Depends(get_current_recruiter),
    db: AsyncSession = Depends(get_db),
):
    vacancy = Vacancy(
        source="internal",
        external_id=None,
        posted_by_user_id=user.id,
        title=data.title,
        organization=data.organization,
        location=data.location,
        contract_type=data.contract_type,
        deadline=data.deadline,
        description=data.description,
        url=data.url or "https://profilo.dev/jobs/pending",
        keywords=data.keywords or [],
        salary_range=data.salary_range,
        is_active=True,
    )
    db.add(vacancy)
    await db.flush()
    if not data.url:
        vacancy.url = f"https://profilo.dev/jobs/{vacancy.id}"
    await db.commit()
    await db.refresh(vacancy)
    return vacancy


@router.put("/{vacancy_id}", response_model=VacancyResponse)
async def update_vacancy(
    vacancy_id: UUID,
    data: VacancyUpdate,
    user: User = Depends(get_current_recruiter),
    db: AsyncSession = Depends(get_db),
):
    vacancy = await db.get(Vacancy, vacancy_id)
    if not vacancy:
        raise HTTPException(status_code=404, detail="Vacancy not found")
    if vacancy.posted_by_user_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed to edit this vacancy")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(vacancy, field, value)

    await db.commit()
    await db.refresh(vacancy)
    return vacancy


@router.delete("/{vacancy_id}", status_code=204)
async def delete_vacancy(
    vacancy_id: UUID,
    user: User = Depends(get_current_recruiter),
    db: AsyncSession = Depends(get_db),
):
    vacancy = await db.get(Vacancy, vacancy_id)
    if not vacancy:
        raise HTTPException(status_code=404, detail="Vacancy not found")
    if vacancy.posted_by_user_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed to delete this vacancy")

    vacancy.is_active = False
    await db.commit()
