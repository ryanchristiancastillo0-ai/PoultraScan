from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from controllers.chicken_image_controller import ChickenImageController
from schemas.chicken_image_schema import CreateChickenImageSchema
from middleware.auth_middleware import get_current_user_id

router = APIRouter(
    prefix="/api/chicken-images",
    tags=["Chicken Images"]
)


@router.post("/")
def create_chicken_image(
    data: CreateChickenImageSchema,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return ChickenImageController.create(data, db)


@router.get("/chicken/{detected_chicken_id}")
def get_images_by_detected_chicken(
    detected_chicken_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return ChickenImageController.get_by_detected_chicken_id(detected_chicken_id, db)


@router.get("/{image_id}")
def get_chicken_image_by_id(
    image_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return ChickenImageController.get_by_id(image_id, db)


@router.get("/")
def get_all_chicken_images(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return ChickenImageController.get_all(skip, limit, db)


@router.delete("/{image_id}")
def delete_chicken_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return ChickenImageController.delete(image_id, db)