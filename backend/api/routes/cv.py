from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.deps import get_current_user, get_db
from backend.api.models import CVProfile, User
from backend.api.schemas import CVProfileResponse, CVProfileUpdate
from backend.services.cv_parser import parse_cv_pdf, extract_profile_features

router = APIRouter()


@router.post("/upload", response_model=CVProfileResponse, status_code=status.HTTP_201_CREATED)
async def upload_cv(
    file: UploadFile,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    content = await file.read()
    raw_text = parse_cv_pdf(content)
    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from PDF")

    features = extract_profile_features(raw_text)

    profile = CVProfile(
        user_id=user.id,
        raw_text=raw_text,
        file_name=file.filename,
        **features,
    )
    db.add(profile)
    await db.commit()
    await db.refresh(profile)

    return profile


@router.get("/profile", response_model=CVProfileResponse)
async def get_profile(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(CVProfile).where(CVProfile.user_id == user.id).order_by(CVProfile.created_at.desc())
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="No CV profile found. Upload a CV first.")
    return profile


@router.put("/profile", response_model=CVProfileResponse)
async def update_profile(
    data: CVProfileUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(CVProfile).where(CVProfile.user_id == user.id).order_by(CVProfile.created_at.desc())
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="No CV profile found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)

    await db.commit()
    await db.refresh(profile)
    return profile


@router.delete("/{cv_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_cv(
    cv_id: UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(CVProfile).where(CVProfile.id == cv_id, CVProfile.user_id == user.id)
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="CV not found")

    await db.delete(profile)
    await db.commit()
