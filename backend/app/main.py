from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from models import hospital, inventory, medicine, user
from models.transfer import Transfer

from routes import (
    ai,
    auth,
    hospitals,
    inventory as inventory_routes,
    medicines,
    transfers,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MediSync AI - Medicine Supply Chain Optimizer",
    description="Backend API for hospital medicine inventory, transfers, and AI-driven demand prediction.",
    version="1.0.0",
)

# ======================
# CORS Configuration
# ======================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================
# Register API Routers
# ======================

app.include_router(hospitals.router)
app.include_router(medicines.router)
app.include_router(inventory_routes.router)
app.include_router(ai.router)
app.include_router(auth.router)
app.include_router(transfers.router)


# ======================
# Root Endpoint
# ======================

@app.get("/")
def root():
    return {
        "message": "MediSync AI Backend is Running 🚀"
    }


# ======================
# Health Check
# ======================

@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }


@app.get("/health/db")
def database_health(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {
        "status": "database connected"
    }