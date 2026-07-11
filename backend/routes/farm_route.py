from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional

from database.database import get_db
from controllers.farm_controller import FarmController
from schemas.farm_schema import UpdateFarmSchema
from middleware.auth_middleware import get_current_user_id

router = APIRouter(
    prefix="/api/farms",
    tags=["Farms"]
)


@router.post("/")
def create_farm(
    farm_name: str = Form(...),
    location: str = Form(...),
    capacity: int = Form(...),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return FarmController.create(farm_name, location, capacity, image, current_user_id, db)


@router.get("/me")
def get_my_farms(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return FarmController.get_my_farms(current_user_id, db)


@router.get("/{farm_id}")
def get_farm_by_id(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return FarmController.get_by_id(farm_id, db)


@router.get("/")
def get_all_farms(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return FarmController.get_all(skip, limit, db)


@router.put("/{farm_id}")
def update_farm(
    farm_id: int,
    farm_name: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    capacity: Optional[int] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    data = UpdateFarmSchema(farm_name=farm_name, location=location, capacity=capacity)
    return FarmController.update(farm_id, current_user_id, data, image, db)


@router.delete("/{farm_id}")
def delete_farm(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return FarmController.delete(farm_id, current_user_id, db)