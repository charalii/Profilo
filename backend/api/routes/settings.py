from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.deps import get_current_user, get_db
from backend.api.models import AlertPreference, User
from backend.api.schemas import (
    AlertPreferenceResponse,
    AlertPreferenceUpdate,
    UserResponse,
    UserUpdate,
)

router = APIRouter()


@router.get("/profile", response_model=UserResponse)
async def get_settings_profile(user: User = Depends(get_current_user)):
    return user


@router.put("/profile", response_model=UserResponse)
async def update_settings_profile(
    data: UserUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if data.name is not None:
        user.name = data.name
    if data.email is not None:
        # Check uniqueness
        existing = await db.execute(
            select(User).where(User.email == data.email, User.id != user.id)
        )
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Email already in use")
        user.email = data.email
    await db.commit()
    await db.refresh(user)
    return user


@router.get("/alerts", response_model=AlertPreferenceResponse | None)
async def get_alert_preferences(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(AlertPreference).where(AlertPreference.user_id == user.id)
    )
    pref = result.scalar_one_or_none()
    return pref


@router.put("/alerts", response_model=AlertPreferenceResponse)
async def update_alert_preferences(
    data: AlertPreferenceUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(AlertPreference).where(AlertPreference.user_id == user.id)
    )
    pref = result.scalar_one_or_none()

    if not pref:
        pref = AlertPreference(user_id=user.id)
        db.add(pref)

    if data.frequency is not None:
        pref.frequency = data.frequency
    if data.min_match_score is not None:
        pref.min_match_score = data.min_match_score
    if data.sources is not None:
        pref.sources = data.sources
    if data.locations is not None:
        pref.locations = data.locations
    if data.is_active is not None:
        pref.is_active = data.is_active

    await db.commit()
    await db.refresh(pref)
    return pref


@router.delete("/alerts", status_code=204)
async def delete_alert_preferences(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(AlertPreference).where(AlertPreference.user_id == user.id)
    )
    pref = result.scalar_one_or_none()
    if pref:
        await db.delete(pref)
        await db.commit()
