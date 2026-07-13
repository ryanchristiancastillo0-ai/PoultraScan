from sqlalchemy.orm import Session
from fastapi import status, UploadFile
from fastapi.responses import JSONResponse
from typing import Optional

from services.farm_service import FarmService
from schemas.farm_schema import CreateFarmSchema, UpdateFarmSchema, FarmResponseSchema
from utils.cloudinary_upload import upload_farm_image


class FarmController:

    @staticmethod
    def create(farm_name: str, location: str, capacity: int, image: Optional[UploadFile], user_id: int, db: Session):
        image_url = upload_farm_image(image) if image else None
        data = CreateFarmSchema(farm_name=farm_name, location=location, capacity=capacity)
        farm = FarmService.create(db, user_id, data, image_url)
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={
                "message": "Farm saved successfully",
                "farm": FarmResponseSchema.model_validate(farm).model_dump(mode="json")
            }
        )

    @staticmethod
    def get_by_id(farm_id: int, db: Session):
        farm = FarmService.find_by_id(db, farm_id)
        return FarmResponseSchema.model_validate(farm)

    @staticmethod
    def get_my_farms(user_id: int, db: Session):
        farms = FarmService.find_by_user_id(db, user_id)
        return [FarmResponseSchema.model_validate(f) for f in farms]

    @staticmethod
    def get_all(skip: int, limit: int, db: Session):
        farms = FarmService.get_all(db, skip, limit)
        return [FarmResponseSchema.model_validate(f) for f in farms]

    @staticmethod
    def update(farm_id: int, user_id: int, data: UpdateFarmSchema, image: Optional[UploadFile], db: Session):
        image_url = upload_farm_image(image) if image else None
        farm = FarmService.update(db, farm_id, user_id, data, image_url)
        return FarmResponseSchema.model_validate(farm)

    @staticmethod
    def delete(farm_id: int, user_id: int, db: Session):
        FarmService.delete(db, farm_id, user_id)
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)