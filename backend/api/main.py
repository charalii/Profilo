from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.routes import auth, cv, vacancies, matching, generation, applications

app = FastAPI(
    title="HireScope API",
    description="AI-Powered Job Matching Platform for EU/International Careers",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://hirescope.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(cv.router, prefix="/api/cv", tags=["CV"])
app.include_router(vacancies.router, prefix="/api/vacancies", tags=["Vacancies"])
app.include_router(matching.router, prefix="/api/match", tags=["Matching"])
app.include_router(generation.router, prefix="/api/generate", tags=["Generation"])
app.include_router(applications.router, prefix="/api/applications", tags=["Applications"])


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "hirescope-api"}
