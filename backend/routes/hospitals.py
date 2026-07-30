from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from models.hospital import Hospital
from routes.auth import get_current_user
from models.user import User

router = APIRouter(prefix="/hospitals", tags=["Hospitals"])


class HospitalCreate(BaseModel):
    name: str
    location: str | None = None


@router.get("/")
def list_hospitals(
    db: Session = Depends(get_db),
):
    return db.query(Hospital).all()


@router.post("/")
def create_hospital(
    hospital: HospitalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_hospital = Hospital(
        name=hospital.name,
        location=hospital.location,
    )

    db.add(new_hospital)
    db.commit()
    db.refresh(new_hospital)

    return new_hospital


@router.put("/{hospital_id}")
def update_hospital(
    hospital_id: int,
    hospital: HospitalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_hospital = (
        db.query(Hospital)
        .filter(Hospital.id == hospital_id)
        .first()
    )

    if not db_hospital:
        raise HTTPException(
            status_code=404,
            detail="Hospital not found",
        )

    db_hospital.name = hospital.name
    db_hospital.location = hospital.location

    db.commit()
    db.refresh(db_hospital)

    return db_hospital


@router.delete("/{hospital_id}")
def delete_hospital(
    hospital_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    hospital = (
        db.query(Hospital)
        .filter(Hospital.id == hospital_id)
        .first()
    )

    if not hospital:
        raise HTTPException(
            status_code=404,
            detail="Hospital not found",
        )

    try:
        db.delete(hospital)
        db.commit()

        return {
            "message": "Hospital deleted successfully"
        }

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=400,
            detail="This hospital has inventory records. Please delete the inventory first."
        )