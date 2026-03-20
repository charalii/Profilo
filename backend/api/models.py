import uuid
from datetime import datetime, date

from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import DeclarativeBase, relationship


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    name = Column(String(255))
    hashed_password = Column(String(255))
    plan = Column(String(20), default="free")
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime)

    cv_profiles = relationship("CVProfile", back_populates="user", cascade="all, delete-orphan")
    matches = relationship("Match", back_populates="user", cascade="all, delete-orphan")
    generated_docs = relationship("GeneratedDoc", back_populates="user", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="user", cascade="all, delete-orphan")
    alert_preferences = relationship("AlertPreference", back_populates="user", cascade="all, delete-orphan")


class CVProfile(Base):
    __tablename__ = "cv_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    raw_text = Column(Text, nullable=False)
    file_url = Column(String(500))
    file_name = Column(String(255))

    has_legal = Column(Boolean, default=False)
    has_defence = Column(Boolean, default=False)
    has_procurement = Column(Boolean, default=False)
    has_policy = Column(Boolean, default=False)
    has_eu = Column(Boolean, default=False)
    has_international = Column(Boolean, default=False)
    years_experience = Column(Integer, default=0)
    education_level = Column(String(50))
    has_cast = Column(Boolean, default=False)
    has_epso = Column(Boolean, default=False)
    language_count = Column(Integer, default=1)
    has_c2 = Column(Boolean, default=False)
    keywords = Column(JSONB, default=[])

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="cv_profiles")
    matches = relationship("Match", back_populates="cv_profile", cascade="all, delete-orphan")


class Vacancy(Base):
    __tablename__ = "vacancies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source = Column(String(50), nullable=False)
    external_id = Column(String(255))
    title = Column(String(500), nullable=False)
    organization = Column(String(255), nullable=False)
    location = Column(String(255))
    contract_type = Column(String(100))
    deadline = Column(Date)
    description = Column(Text)
    url = Column(String(1000), nullable=False)
    keywords = Column(JSONB, default=[])
    salary_range = Column(String(100))
    is_active = Column(Boolean, default=True)
    scraped_at = Column(DateTime, default=datetime.utcnow)
    last_checked = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint("source", "external_id", name="uq_vacancy_source_external"),
        Index("idx_vacancies_active", "is_active", "deadline"),
        Index("idx_vacancies_source", "source"),
    )

    matches = relationship("Match", back_populates="vacancy", cascade="all, delete-orphan")
    generated_docs = relationship("GeneratedDoc", back_populates="vacancy", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="vacancy", cascade="all, delete-orphan")


class Match(Base):
    __tablename__ = "matches"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    cv_profile_id = Column(UUID(as_uuid=True), ForeignKey("cv_profiles.id", ondelete="CASCADE"), nullable=False)
    vacancy_id = Column(UUID(as_uuid=True), ForeignKey("vacancies.id", ondelete="CASCADE"), nullable=False)
    match_score = Column(Integer, nullable=False)
    matched_keywords = Column(JSONB, default=[])
    missing_keywords = Column(JSONB, default=[])
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint("cv_profile_id", "vacancy_id", name="uq_match_cv_vacancy"),
        Index("idx_matches_user", "user_id", "match_score"),
        Index("idx_matches_vacancy", "vacancy_id"),
    )

    user = relationship("User", back_populates="matches")
    cv_profile = relationship("CVProfile", back_populates="matches")
    vacancy = relationship("Vacancy", back_populates="matches")


class GeneratedDoc(Base):
    __tablename__ = "generated_docs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    vacancy_id = Column(UUID(as_uuid=True), ForeignKey("vacancies.id", ondelete="CASCADE"), nullable=False)
    doc_type = Column(String(20), nullable=False)
    content = Column(Text, nullable=False)
    model_used = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="generated_docs")
    vacancy = relationship("Vacancy", back_populates="generated_docs")


class Application(Base):
    __tablename__ = "applications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    vacancy_id = Column(UUID(as_uuid=True), ForeignKey("vacancies.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(30), default="interested")
    applied_at = Column(Date)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="applications")
    vacancy = relationship("Vacancy", back_populates="applications")


class AlertPreference(Base):
    __tablename__ = "alert_preferences"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    frequency = Column(String(20), default="weekly")
    min_match_score = Column(Integer, default=60)
    sources = Column(JSONB, default=[])
    locations = Column(JSONB, default=[])
    is_active = Column(Boolean, default=True)

    user = relationship("User", back_populates="alert_preferences")
