from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from models.hospital import Hospital
from models.inventory import Inventory
from models.medicine import Medicine
from models.user import User
from routes.auth import get_current_user

router = APIRouter(prefix="/ai", tags=["AI"])


@router.get("/predictions")
def get_predictions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Fetch inventory for ALL hospitals
    inventory = db.query(Inventory).all()

    hospital_map = {
        h.id: h.name
        for h in db.query(Hospital).all()
    }

    medicine_map = {
        m.id: m.name
        for m in db.query(Medicine).all()
    }

    predictions = []

    for item in inventory:
        quantity = item.quantity

        if quantity < 100:
            status = "Critical"
            recommendation = "Restock Immediately"

        elif quantity < 300:
            status = "Low Stock"
            recommendation = "Order Soon"

        elif quantity <= 1000:
            status = "Healthy"
            recommendation = "No Action Needed"

        else:
            status = "Overstock"

            receiver = next(
                (
                    x
                    for x in inventory
                    if x.medicine_id == item.medicine_id
                    and x.hospital_id != item.hospital_id
                    and x.quantity < 300
                ),
                None,
            )

            if receiver:
                recommendation = (
                    f"Transfer 300 units to "
                    f"{hospital_map.get(receiver.hospital_id)}"
                )
            else:
                recommendation = "Transfer to Another Hospital"

        predictions.append(
            {
                "hospital_id": item.hospital_id,
                "medicine_id": item.medicine_id,
                "hospital": hospital_map.get(item.hospital_id),
                "medicine": medicine_map.get(item.medicine_id),
                "quantity": quantity,
                "status": status,
                "recommendation": recommendation,
            }
        )

    return predictions