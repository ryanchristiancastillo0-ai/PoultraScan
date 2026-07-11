from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import os

from models.chicken_image import ChickenImage
from schemas.chicken_image_schema import CreateChickenImageSchema


class ChickenImageService:

    @staticmethod
    def create(db: Session, data: CreateChickenImageSchema) -> ChickenImage:
        new_image = ChickenImage(
            detected_chicken_id=data.detected_chicken_id,
            image_type=data.image_type.value,
            image_url=data.image_url
        )
        db.add(new_image)
        db.commit()
        db.refresh(new_image)
        return new_image

    @staticmethod
    def find_by_id(db: Session, image_id: int) -> ChickenImage:
        image = db.query(ChickenImage).filter(ChickenImage.id == image_id).first()
        if not image:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chicken image not found")
        return image

    @staticmethod
    def find_by_detected_chicken_id(db: Session, detected_chicken_id: int) -> list[ChickenImage]:
        return (
            db.query(ChickenImage)
            .filter(ChickenImage.detected_chicken_id == detected_chicken_id)
            .all()
        )

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[ChickenImage]:
        return db.query(ChickenImage).offset(skip).limit(limit).all()

    @staticmethod
    def delete(db: Session, image_id: int) -> None:
        image = ChickenImageService.find_by_id(db, image_id)

        # also remove the physical file from disk, not just the DB row
        file_path = image.image_url.lstrip("/")
        if os.path.exists(file_path):
            os.remove(file_path)

        db.delete(image)
        db.commit()