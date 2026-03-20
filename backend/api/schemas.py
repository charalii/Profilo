from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


# ── Auth ──


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    name: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: UUID
    email: str
    name: str | None
    plan: str
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ── CV ──


class CVProfileResponse(BaseModel):
    id: UUID
    raw_text: str
    file_url: str | None
    file_name: str | None
    has_legal: bool
    has_defence: bool
    has_procurement: bool
    has_policy: bool
    has_eu: bool
    has_international: bool
    years_experience: int
    education_level: str | None
    has_cast: bool
    has_epso: bool
    language_count: int
    has_c2: bool
    keywords: list[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class CVProfileUpdate(BaseModel):
    has_legal: bool | None = None
    has_defence: bool | None = None
    has_procurement: bool | None = None
    has_policy: bool | None = None
    has_eu: bool | None = None
    has_international: bool | None = None
    years_experience: int | None = None
    education_level: str | None = None
    has_cast: bool | None = None
    has_epso: bool | None = None
    language_count: int | None = None
    has_c2: bool | None = None
    keywords: list[str] | None = None


# ── Vacancies ──


class VacancyResponse(BaseModel):
    id: UUID
    source: str
    title: str
    organization: str
    location: str | None
    contract_type: str | None
    deadline: date | None
    description: str | None
    url: str
    keywords: list[str]
    salary_range: str | None
    is_active: bool
    scraped_at: datetime

    model_config = {"from_attributes": True}


class VacancyListResponse(BaseModel):
    items: list[VacancyResponse]
    total: int
    page: int
    limit: int


# ── Matching ──


class MatchBreakdown(BaseModel):
    keyword_overlap: int
    domain_fit: int
    qualification: int
    experience: int
    language: int


class MatchResponse(BaseModel):
    id: UUID
    vacancy: VacancyResponse
    match_score: int
    matched_keywords: list[str]
    missing_keywords: list[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class MatchListResponse(BaseModel):
    items: list[MatchResponse]
    total: int


# ── Generation ──


class GenerateRequest(BaseModel):
    vacancy_id: UUID


class GeneratedDocResponse(BaseModel):
    id: UUID
    vacancy_id: UUID
    doc_type: str
    content: str
    model_used: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Applications ──


class ApplicationCreate(BaseModel):
    vacancy_id: UUID
    status: str = "interested"


class ApplicationUpdate(BaseModel):
    status: str | None = None
    applied_at: date | None = None
    notes: str | None = None


class ApplicationResponse(BaseModel):
    id: UUID
    vacancy: VacancyResponse
    status: str
    applied_at: date | None
    notes: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ── Alerts ──


class AlertPreferenceResponse(BaseModel):
    id: UUID
    frequency: str
    min_match_score: int
    sources: list[str]
    locations: list[str]
    is_active: bool

    model_config = {"from_attributes": True}


class AlertPreferenceUpdate(BaseModel):
    frequency: str | None = None
    min_match_score: int | None = None
    sources: list[str] | None = None
    locations: list[str] | None = None
    is_active: bool | None = None
