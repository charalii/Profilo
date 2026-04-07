import logging
import time
from collections import defaultdict
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from backend.api.deps import engine
from backend.api.models import Base
from backend.api.routes import (
    analytics,
    applications,
    auth,
    billing,
    candidates,
    cv,
    dev,
    generation,
    humanizer,
    matching,
    settings,
    vacancies,
)

logger = logging.getLogger("profilo")


@asynccontextmanager
async def lifespan(application: FastAPI):
    # Startup: create tables if they don't exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables ready")
    yield
    # Shutdown: dispose engine connection pool
    await engine.dispose()
    logger.info("Database connections closed")


app = FastAPI(
    title="Profilo API",
    description="AI-Powered Job Matching Platform for EU/International Careers",
    version="1.0.0",
    lifespan=lifespan,
)

# Browser sends exact Origin (scheme + host + port). Next dev may use 3000, 3001, etc.
# Regex covers any local dev port; explicit list covers common cases without relying on regex alone.
_LOCAL_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

# ── Rate limiter ──
# Tracks per-IP request counts with a sliding window.
# /api/generate/* endpoints get a tighter limit (20 req/min) to control API costs.
# All other endpoints: 120 req/min.

_rate_buckets: dict[str, list[float]] = defaultdict(list)

# Paths that start with these prefixes get the tight limit
_EXPENSIVE_PREFIXES = ("/api/generate/", "/api/v1/generate/")
_TIGHT_LIMIT = 20  # per minute
_DEFAULT_LIMIT = 120  # per minute
_WINDOW = 60.0  # seconds


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "unknown"
        path = request.url.path

        is_expensive = any(path.startswith(p) for p in _EXPENSIVE_PREFIXES)
        limit = _TIGHT_LIMIT if is_expensive else _DEFAULT_LIMIT
        bucket_key = f"{client_ip}:{'gen' if is_expensive else 'all'}"

        now = time.monotonic()
        # Prune old entries
        _rate_buckets[bucket_key] = [
            t for t in _rate_buckets[bucket_key] if now - t < _WINDOW
        ]

        if len(_rate_buckets[bucket_key]) >= limit:
            return Response(
                content='{"detail":"Rate limit exceeded. Please try again later."}',
                status_code=429,
                media_type="application/json",
                headers={"Retry-After": "60"},
            )

        _rate_buckets[bucket_key].append(now)
        return await call_next(request)


app.add_middleware(RateLimitMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        *_LOCAL_ORIGINS,
        "https://profilo.dev",
        "https://www.profilo.dev",
    ],
    allow_origin_regex=r"^http://(localhost|127\.0\.0\.1):\d+$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for api_prefix in ("/api", "/api/v1"):
    app.include_router(dev.router, prefix=f"{api_prefix}/dev", tags=["Dev"])
    app.include_router(auth.router, prefix=f"{api_prefix}/auth", tags=["Auth"])
    app.include_router(cv.router, prefix=f"{api_prefix}/cv", tags=["CV"])
    app.include_router(vacancies.router, prefix=f"{api_prefix}/vacancies", tags=["Vacancies"])
    app.include_router(matching.router, prefix=f"{api_prefix}/match", tags=["Matching"])
    app.include_router(generation.router, prefix=f"{api_prefix}/generate", tags=["Generation"])
    app.include_router(applications.router, prefix=f"{api_prefix}/applications", tags=["Applications"])
    app.include_router(analytics.router, prefix=f"{api_prefix}/analytics", tags=["Analytics"])
    app.include_router(candidates.router, prefix=f"{api_prefix}/candidates", tags=["Candidates"])
    app.include_router(settings.router, prefix=f"{api_prefix}/settings", tags=["Settings"])
    app.include_router(humanizer.router, prefix=f"{api_prefix}/generate", tags=["Generation"])
    app.include_router(billing.router, prefix=f"{api_prefix}/billing", tags=["Billing"])


@app.get("/api/health")
@app.get("/api/v1/health")
async def health_check():
    return {"status": "ok", "service": "profilo-api"}
