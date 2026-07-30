from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from models.medicine import Medicine
from models.inventory import Inventory
from models.transfer import Transfer
from models.user import User
from routes.auth import get_current_user

router = APIRouter(prefix="/medicines", tags=["Medicines"])


class MedicineCreate(BaseModel):
    name: str
    category: str | None = None


@router.get("/")
def list_medicines(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Medicine).all()


@router.post("/")
def create_medicine(
    medicine: MedicineCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_medicine = Medicine(
        name=medicine.name,
        category=medicine.category,
    )

    db.add(new_medicine)
    db.commit()
    db.refresh(new_medicine)

    return new_medicine


@router.put("/{medicine_id}")
def update_medicine(
    medicine_id: int,
    medicine: MedicineCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_medicine = (
        db.query(Medicine)
        .filter(Medicine.id == medicine_id)
        .first()
    )

    if not db_medicine:
        raise HTTPException(
            status_code=404,
            detail="Medicine not found",
        )

    db_medicine.name = medicine.name
    db_medicine.category = medicine.category

    db.commit()
    db.refresh(db_medicine)

    return db_medicine


@router.delete("/{medicine_id}")
def delete_medicine(
    medicine_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    medicine = (
        db.query(Medicine)
        .filter(Medicine.id == medicine_id)
        .first()
    )

    if not medicine:
        raise HTTPException(
            status_code=404,
            detail="Medicine not found"
        )

    # delete inventory records first
    db.query(Inventory).filter(
        Inventory.medicine_id == medicine_id
    ).delete()

    # delete transfer history records
    db.query(Transfer).filter(
        Transfer.medicine_id == medicine_id
    ).delete()

    # delete medicine
    db.delete(medicine)

    db.commit()

    return {
        "message": "Medicine deleted successfully"
    }