from sqlalchemy.orm import Session
from fastapi import status
from fastapi.responses import JSONResponse

from services.chicken_image_service import ChickenImageService
from schemas.chicken_image_schema import CreateChickenImageSchema, ChickenImageResponseSchema


class ChickenImageController:

    @staticmethod
    def create(data: CreateChickenImageSchema, db: Session):
        image = ChickenImageService.create(db, data)
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={
                "message": "Chicken image created successfully",
                "image": ChickenImageResponseSchema.model_validate(image).model_dump(mode="json")
            }
        )

    @staticmethod
    def get_by_id(image_id: int, db: Session):
        image = ChickenImageService.find_by_id(db, image_id)
        return ChickenImageResponseSchema.model_validate(image)

    @staticmethod
    def get_by_detected_chicken_id(detected_chicken_id: int, db: Session):
        images = ChickenImageService.find_by_detected_chicken_id(db, detected_chicken_id)
        return [ChickenImageResponseSchema.model_validate(i) for i in images]

    @staticmethod
    def get_all(skip: int, limit: int, db: Session):
        images = ChickenImageService.get_all(db, skip, limit)
        return [ChickenImageResponseSchema.model_validate(i) for i in images]

    @staticmethod
    def delete(image_id: int, db: Session):
        ChickenImageService.delete(db, image_id)
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)