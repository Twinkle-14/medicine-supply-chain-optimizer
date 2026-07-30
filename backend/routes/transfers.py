from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from models.transfer import Transfer
from models.inventory import Inventory
from models.hospital import Hospital
from models.medicine import Medicine
from models.user import User
from routes.auth import get_current_user

router = APIRouter(prefix="/transfers", tags=["Transfers"])


class TransferCreate(BaseModel):
    from_hospital_id: int
    to_hospital_id: int
    medicine_id: int
    quantity: int


@router.get("/")
def list_transfers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    transfers = db.query(Transfer).all()

    hospital_map = {
        h.id: h.name
        for h in db.query(Hospital).all()
    }

    medicine_map = {
        m.id: m.name
        for m in db.query(Medicine).all()
    }

    result = []

    for transfer in transfers:
        result.append(
            {
                "id": transfer.id,
                "from_hospital_id": transfer.from_hospital_id,
                "to_hospital_id": transfer.to_hospital_id,
                "medicine_id": transfer.medicine_id,
                "from_hospital": hospital_map.get(
                    transfer.from_hospital_id
                ),
                "to_hospital": hospital_map.get(
                    transfer.to_hospital_id
                ),
                "medicine": medicine_map.get(
                    transfer.medicine_id
                ),
                "quantity": transfer.quantity,
                "status": transfer.status,
            }
        )

    return result


@router.post("/")
def execute_transfer(
    transfer: TransferCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    source_inventory = (
        db.query(Inventory)
        .filter(
            Inventory.hospital_id == transfer.from_hospital_id,
            Inventory.medicine_id == transfer.medicine_id,
        )
        .first()
    )

    if not source_inventory:
        raise HTTPException(
            status_code=404,
            detail="Medicine not found in source hospital.",
        )

    if source_inventory.quantity < transfer.quantity:
        raise HTTPException(
            status_code=400,
            detail="Not enough stock available.",
        )

    destination_inventory = (
        db.query(Inventory)
        .filter(
            Inventory.hospital_id == transfer.to_hospital_id,
            Inventory.medicine_id == transfer.medicine_id,
        )
        .first()
    )

    source_inventory.quantity -= transfer.quantity

    if destination_inventory:
        destination_inventory.quantity += transfer.quantity
    else:
        destination_inventory = Inventory(
            hospital_id=transfer.to_hospital_id,
            medicine_id=transfer.medicine_id,
            quantity=transfer.quantity,
        )
        db.add(destination_inventory)

    new_transfer = Transfer(
        from_hospital_id=transfer.from_hospital_id,
        to_hospital_id=transfer.to_hospital_id,
        medicine_id=transfer.medicine_id,
        quantity=transfer.quantity,
        status="Completed",
    )

    db.add(new_transfer)

    db.commit()
    db.refresh(new_transfer)

    return {
        "message": "Transfer completed successfully.",
        "transfer": new_transfer,
    }
@router.delete("/{transfer_id}")
def delete_transfer(
    transfer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    transfer = (
        db.query(Transfer)
        .filter(Transfer.id == transfer_id)
        .first()
    )

    if not transfer:
        raise HTTPException(
            status_code=404,
            detail="Transfer not found",
        )

    db.delete(transfer)
    db.commit()

    return {
        "message": "Transfer deleted successfully"
    }