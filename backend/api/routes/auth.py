import logging
import secrets

from fastapi import APIRouter, Depends, HTTPException, Request, status
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.deps import create_access_token, get_current_user, get_db
from backend.api.models import User
from backend.api.schemas import TokenResponse, UserLogin, UserRegister, UserResponse

logger = logging.getLogger(__name__)

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# In-memory store for email verification tokens: token -> user_id (str)
_verification_tokens: dict[str, str] = {}
# In-memory set of verified user ids (str)
_verified_users: set[str] = set()

ADMIN_TOKEN = "profilo-admin-2026"


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(data: UserRegister, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(User).where(User.email == data.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=data.email,
        name=data.name,
        hashed_password=pwd_context.hash(data.password),
        role=data.role,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    # Generate email verification token
    token = secrets.token_urlsafe(32)
    _verification_tokens[token] = str(user.id)

    # Attempt to send verification email; skip gracefully if SMTP not configured
    try:
        import aiosmtplib
        from email.message import EmailMessage
        msg = EmailMessage()
        msg["Subject"] = "Verify your Profilo account"
        msg["From"] = "noreply@profilo.eu"
        msg["To"] = user.email
        msg.set_content(
            f"Welcome to Profilo!\n\nVerify your email by visiting:\n"
            f"https://profilo.eu/verify-email?token={token}\n"
        )
        await aiosmtplib.send(msg, hostname="localhost", port=587)
        logger.info("Verification email sent to %s", user.email)
    except Exception as exc:
        logger.info(
            "Email verification requires SMTP setup — skipping send (%s)", exc
        )

    return TokenResponse(access_token=create_access_token(user.id))


@router.get("/me", response_model=UserResponse)
async def me(user: User = Depends(get_current_user)):
    return user


@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    if not user or not pwd_context.verify(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return TokenResponse(access_token=create_access_token(user.id))


@router.get("/verify-email")
async def verify_email(token: str):
    user_id = _verification_tokens.get(token)
    if not user_id:
        raise HTTPException(status_code=400, detail="Invalid or expired verification token")
    _verified_users.add(user_id)
    del _verification_tokens[token]
    return {"message": "Email verified successfully"}


@router.get("/admin/users")
async def admin_list_users(request: Request, db: AsyncSession = Depends(get_db)):
    auth_header = request.headers.get("Authorization", "")
    if auth_header != f"Bearer {ADMIN_TOKEN}":
        raise HTTPException(status_code=403, detail="Forbidden")

    result = await db.execute(select(User))
    users = result.scalars().all()
    return [
        {
            "email": u.email,
            "name": u.name,
            "role": u.role,
            "created_at": u.created_at.isoformat() if u.created_at else None,
        }
        for u in users
    ]
