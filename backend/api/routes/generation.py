from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.deps import get_current_user, get_db
from backend.api.models import CVProfile, GeneratedDoc, User, Vacancy
from backend.api.schemas import GenerateRequest, GeneratedDocResponse
from backend.services.ai_generator import generate_cover_letter, generate_cv_optimization

router = APIRouter()


@router.post("/cover-letter", response_model=GeneratedDocResponse, status_code=201)
async def create_cover_letter(
    data: GenerateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    vacancy = await db.get(Vacancy, data.vacancy_id)
    if not vacancy:
        raise HTTPException(status_code=404, detail="Vacancy not found")

    result = await db.execute(
        select(CVProfile).where(CVProfile.user_id == user.id).order_by(CVProfile.created_at.desc())
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=400, detail="Upload a CV first")

    content, model_used = await generate_cover_letter(profile.raw_text, vacancy)

    doc = GeneratedDoc(
        user_id=user.id,
        vacancy_id=vacancy.id,
        doc_type="cover_letter",
        content=content,
        model_used=model_used,
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    return doc


@router.post("/cv-optimization", response_model=GeneratedDocResponse, status_code=201)
async def create_cv_optimization(
    data: GenerateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    vacancy = await db.get(Vacancy, data.vacancy_id)
    if not vacancy:
        raise HTTPException(status_code=404, detail="Vacancy not found")

    result = await db.execute(
        select(CVProfile).where(CVProfile.user_id == user.id).order_by(CVProfile.created_at.desc())
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=400, detail="Upload a CV first")

    content, model_used = await generate_cv_optimization(profile.raw_text, vacancy)

    doc = GeneratedDoc(
        user_id=user.id,
        vacancy_id=vacancy.id,
        doc_type="cv_optimization",
        content=content,
        model_used=model_used,
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    return doc


@router.get("/history", response_model=list[GeneratedDocResponse])
async def get_generation_history(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(GeneratedDoc)
        .where(GeneratedDoc.user_id == user.id)
        .order_by(GeneratedDoc.created_at.desc())
    )
    return result.scalars().all()
