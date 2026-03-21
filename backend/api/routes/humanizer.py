from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.deps import get_current_user, get_db
from backend.api.models import CVProfile, GeneratedDoc, User, Vacancy
from backend.api.schemas import (
    ApplicationAnswerRequest,
    GeneratedDocResponse,
    HumanizeRequest,
)
from backend.services.humanizer import generate_application_answer, humanize_text

router = APIRouter()


@router.post("/application-answer", response_model=GeneratedDocResponse)
async def gen_application_answer(
    data: ApplicationAnswerRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Get user's CV
    result = await db.execute(
        select(CVProfile)
        .where(CVProfile.user_id == user.id)
        .order_by(CVProfile.created_at.desc())
    )
    cv = result.scalar_one_or_none()
    if not cv:
        raise HTTPException(status_code=400, detail="Upload a CV first")

    # Get vacancy if provided
    vacancy_title = data.vacancy_title or ""
    vacancy_org = data.vacancy_org or ""
    vacancy_desc = data.vacancy_description or ""

    if data.vacancy_id:
        vacancy = await db.get(Vacancy, data.vacancy_id)
        if vacancy:
            vacancy_title = vacancy_title or vacancy.title
            vacancy_org = vacancy_org or vacancy.organization
            vacancy_desc = vacancy_desc or (vacancy.description or "")

    content, model_used = await generate_application_answer(
        question=data.question,
        cv_text=cv.raw_text,
        vacancy_title=vacancy_title,
        vacancy_org=vacancy_org,
        vacancy_description=vacancy_desc,
        word_limit=data.word_limit,
        language=data.language or "en",
    )

    doc = GeneratedDoc(
        user_id=user.id,
        vacancy_id=data.vacancy_id,
        doc_type="application_answer",
        content=content,
        model_used=model_used,
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    return doc


@router.post("/humanize", response_model=GeneratedDocResponse)
async def humanize_existing_text(
    data: HumanizeRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    content, model_used = await humanize_text(data.text)

    doc = GeneratedDoc(
        user_id=user.id,
        vacancy_id=data.vacancy_id,
        doc_type="humanized",
        content=content,
        model_used=model_used,
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    return doc
