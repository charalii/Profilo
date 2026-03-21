from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.api.deps import get_current_recruiter, get_current_user, get_db
from backend.api.models import Application, User, Vacancy
from backend.api.schemas import (
    ApplicationCreate,
    ApplicationRecruiterResponse,
    ApplicationResponse,
    ApplicationUpdate,
    VacancyResponse,
)
from backend.services.email_alerts import notify_application_status_change

router = APIRouter()


def _serialize_recruiter_app(app: Application) -> ApplicationRecruiterResponse:
    cand = app.user
    return ApplicationRecruiterResponse(
        id=app.id,
        vacancy=VacancyResponse.model_validate(app.vacancy),
        status=app.status,
        applied_at=app.applied_at,
        notes=app.notes,
        created_at=app.created_at,
        updated_at=app.updated_at,
        candidate_user_id=cand.id,
        candidate_name=cand.name,
        candidate_email=cand.email,
    )


@router.get("", response_model=list[ApplicationResponse])
async def list_my_applications(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if user.role == "recruiter":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Use /applications/recruiter for recruiter inbox",
        )
    result = await db.execute(
        select(Application)
        .options(selectinload(Application.vacancy), selectinload(Application.user))
        .where(Application.user_id == user.id)
        .order_by(Application.updated_at.desc())
    )
    return result.scalars().all()


@router.get("/recruiter", response_model=list[ApplicationRecruiterResponse])
async def list_recruiter_applications(
    user: User = Depends(get_current_recruiter),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Application)
        .options(selectinload(Application.vacancy), selectinload(Application.user))
        .join(Vacancy, Application.vacancy_id == Vacancy.id)
        .where(Vacancy.posted_by_user_id == user.id)
        .order_by(Application.updated_at.desc())
    )
    apps = result.scalars().all()
    return [_serialize_recruiter_app(a) for a in apps]


@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
async def create_application(
    data: ApplicationCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if user.role == "recruiter":
        raise HTTPException(status_code=400, detail="Recruiters cannot create candidate applications")

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
        select(Application)
        .options(selectinload(Application.vacancy))
        .where(Application.id == app.id)
    )
    return result.scalar_one()


@router.put("/{app_id}", response_model=ApplicationResponse)
async def update_application(
    app_id: UUID,
    data: ApplicationUpdate,
    background_tasks: BackgroundTasks,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Application)
        .options(selectinload(Application.vacancy), selectinload(Application.user))
        .where(Application.id == app_id)
    )
    app = result.scalar_one_or_none()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    if user.role == "recruiter":
        vac = app.vacancy
        if not vac or vac.posted_by_user_id != user.id:
            raise HTTPException(status_code=403, detail="Not allowed to update this application")
    else:
        if app.user_id != user.id:
            raise HTTPException(status_code=404, detail="Application not found")

    prev_status = app.status
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(app, field, value)

    await db.commit()
    await db.refresh(app)

    new_status = app.status
    if prev_status != new_status:
        recipient = app.user
        vac = app.vacancy
        background_tasks.add_task(
            notify_application_status_change,
            to_email=recipient.email,
            candidate_name=recipient.name,
            job_title=vac.title if vac else "Role",
            organization=vac.organization if vac else "",
            old_status=prev_status,
            new_status=new_status,
        )

    result = await db.execute(
        select(Application).options(selectinload(Application.vacancy)).where(Application.id == app.id)
    )
    return result.scalar_one()


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
