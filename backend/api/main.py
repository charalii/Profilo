from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.routes import (
    analytics,
    applications,
    auth,
    candidates,
    cv,
    dev,
    generation,
    humanizer,
    matching,
    settings,
    vacancies,
)

app = FastAPI(
    title="HireScope API",
    description="AI-Powered Job Matching Platform for EU/International Careers",
    version="1.0.0",
)

# Browser sends exact Origin (scheme + host + port). Next dev may use 3000, 3001, etc.
# Regex covers any local dev port; explicit list covers common cases without relying on regex alone.
_LOCAL_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        *_LOCAL_ORIGINS,
        "https://hirescope.app",
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


@app.get("/api/health")
@app.get("/api/v1/health")
async def health_check():
    return {"status": "ok", "service": "hirescope-api"}
