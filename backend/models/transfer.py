from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base


class Transfer(Base):
    __tablename__ = "transfers"

    id = Column(Integer, primary_key=True, index=True)

    from_hospital_id = Column(
        Integer,
        ForeignKey("hospitals.id"),
        nullable=False,
    )

    to_hospital_id = Column(
        Integer,
        ForeignKey("hospitals.id"),
        nullable=False,
    )

    medicine_id = Column(
        Integer,
        ForeignKey("medicines.id"),
        nullable=False,
    )

    quantity = Column(Integer, nullable=False)

    status = Column(String, default="Pending")