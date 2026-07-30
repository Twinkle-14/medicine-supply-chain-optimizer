from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from models.hospital import Hospital
from models.inventory import Inventory
from models.medicine import Medicine
from routes.auth import get_current_user
from models.user import User

router = APIRouter(prefix="/inventory", tags=["Inventory"])


class InventoryCreate(BaseModel):
    hospital_id: int
    medicine_id: int
    quantity: int


@router.get("/")
def list_inventory(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    inventory = db.query(Inventory).all()

    result = []

    for item in inventory:
        hospital = (
            db.query(Hospital)
            .filter(Hospital.id == item.hospital_id)
            .first()
        )

        medicine = (
            db.query(Medicine)
            .filter(Medicine.id == item.medicine_id)
            .first()
        )

        result.append(
            {
                "id": item.id,
                "hospital_id": item.hospital_id,
                "hospital": hospital.name if hospital else "Unknown",
                "medicine_id": item.medicine_id,
                "medicine": medicine.name if medicine else "Unknown",
                "quantity": item.quantity,
            }
        )

    return result


@router.post("/")
def create_inventory(
    item: InventoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = (
        db.query(Inventory)
        .filter(
            Inventory.hospital_id == item.hospital_id,
            Inventory.medicine_id == item.medicine_id,
        )
        .first()
    )

    if existing:
        existing.quantity += item.quantity
        db.commit()
        db.refresh(existing)
        return existing

    new_item = Inventory(
        hospital_id=item.hospital_id,
        medicine_id=item.medicine_id,
        quantity=item.quantity,
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item


@router.put("/{inventory_id}")
def update_inventory(
    inventory_id: int,
    item: InventoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    inventory = (
        db.query(Inventory)
        .filter(Inventory.id == inventory_id)
        .first()
    )

    if not inventory:
        raise HTTPException(
            status_code=404,
            detail="Inventory record not found",
        )

    inventory.hospital_id = item.hospital_id
    inventory.medicine_id = item.medicine_id
    inventory.quantity = item.quantity

    db.commit()
    db.refresh(inventory)

    return inventory


@router.delete("/{inventory_id}")
def delete_inventory(
    inventory_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    inventory = (
        db.query(Inventory)
        .filter(Inventory.id == inventory_id)
        .first()
    )

    if not inventory:
        raise HTTPException(
            status_code=404,
            detail="Inventory record not found",
        )

    db.delete(inventory)
    db.commit()

    return {
        "message": "Inventory deleted successfully"
    }