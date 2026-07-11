from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.orm import Session

from database.database import get_db
from controllers.user_controller import UserController
from schemas.user_schema import UpdateUserSchema
from middleware.auth_middleware import get_current_user_id

router = APIRouter(
    prefix="/api/users",
    tags=["Users"]
)


@router.get("/{user_id}")
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view this user")
    return UserController.get_by_id(user_id, db)


@router.get("")
def get_all_users(
    skip: int = Query(0),
    limit: int = Query(100),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return UserController.get_all(skip, limit, db)


@router.put("/{user_id}")
def update_user(
    user_id: int,
    data: UpdateUserSchema,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this user")
    return UserController.update(user_id, data, db)


@router.post("/{user_id}/avatar")
def upload_avatar(
    user_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this user")
    return UserController.upload_avatar(user_id, file, db)


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this user")
    return UserController.delete(user_id, db)