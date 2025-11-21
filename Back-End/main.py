from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app.models import Base
from app.routers import users, judges, admins, auth, cases

app = FastAPI(title="Differential Case Flow Management System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(judges.router, prefix="/api/judges", tags=["Judges"])
app.include_router(admins.router, prefix="/api/admins", tags=["Admins"])
app.include_router(cases.router, prefix="/api/cases", tags=["Cases"])

@app.get("/")
def root():
    return {
        "message": "Differential Case Flow Management System",
        "description": "Multi-level queue scheduling for case management"
    }
