from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.farm import Farm
from schemas.farm_schema import CreateFarmSchema, UpdateFarmSchema


class FarmService:

    @staticmethod
    def create(db: Session, user_id: int, data: CreateFarmSchema, image_url: str | None = None) -> Farm:
        new_farm = Farm(
            user_id=user_id,
            farm_name=data.farm_name,
            location=data.location,
            capacity=data.capacity,
            image_url=image_url
        )
        db.add(new_farm)
        db.commit()
        db.refresh(new_farm)
        return new_farm

    @staticmethod
    def find_by_id(db: Session, farm_id: int) -> Farm:
        farm = db.query(Farm).filter(Farm.id == farm_id).first()
        if not farm:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farm not found")
        return farm

    @staticmethod
    def find_by_user_id(db: Session, user_id: int) -> list[Farm]:
        return db.query(Farm).filter(Farm.user_id == user_id).all()

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[Farm]:
        return db.query(Farm).offset(skip).limit(limit).all()

    @staticmethod
    def update(db: Session, farm_id: int, user_id: int, data: UpdateFarmSchema, image_url: str | None = None) -> Farm:
        farm = FarmService.find_by_id(db, farm_id)

        if farm.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not own this farm")

        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(farm, key, value)

        if image_url:
            farm.image_url = image_url

        db.commit()
        db.refresh(farm)
        return farm

    @staticmethod
    def delete(db: Session, farm_id: int, user_id: int) -> None:
        farm = FarmService.find_by_id(db, farm_id)

        if farm.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not own this farm")

        db.delete(farm)
        db.commit()