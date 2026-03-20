from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.api.deps import get_current_user, get_db
from backend.api.models import Application, User, Vacancy
from backend.api.schemas import ApplicationCreate, ApplicationResponse, ApplicationUpdate

router = APIRouter()


@router.get("", response_model=list[ApplicationResponse])
async def list_applications(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Application)
        .options(selectinload(Application.vacancy))
        .where(Application.user_id == user.id)
        .order_by(Application.updated_at.desc())
    )
    return result.scalars().all()


@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
async def create_application(
    data: ApplicationCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    vacancy = await db.get(Vacancy, data.vacancy_id)
    if not vacancy:
        raise HTTPException(status_code=404, detail="Vacancy not found")

    app = Application(
        user_id=user.id,
        vacancy_id=data.vacancy_id,
        status=data.status,
    )
    db.add(app)
    await db.commit()
    await db.refresh(app)

    result = await db.execute(
        select(Application).options(selectinload(Application.vacancy)).where(Application.id == app.id)
    )
    return result.scalar_one()


@router.put("/{app_id}", response_model=ApplicationResponse)
async def update_application(
    app_id: UUID,
    data: ApplicationUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Application)
        .options(selectinload(Application.vacancy))
        .where(Application.id == app_id, Application.user_id == user.id)
    )
    app = result.scalar_one_or_none()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(app, field, value)

    await db.commit()
    await db.refresh(app)
    return app


@router.delete("/{app_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_application(
    app_id: UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Application).where(Application.id == app_id, Application.user_id == user.id)
    )
    app = result.scalar_one_or_none()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    await db.delete(app)
    await db.commit()
