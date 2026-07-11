from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from schemas.user_schema import RegisterUserSchema, UpdateUserSchema
from services.user_service import UserService


class UserController:

    @staticmethod
    def register(user: RegisterUserSchema, db: Session):
        try:
            return UserService.register(db, user)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def get_by_id(user_id: int, db: Session):
        return UserService.find_by_id(db, user_id)

    @staticmethod
    def get_all(skip: int, limit: int, db: Session):
        return UserService.get_all(db, skip, limit)

    @staticmethod
    def update(user_id: int, data: UpdateUserSchema, db: Session):
        return UserService.update(db, user_id, data)

    @staticmethod
    def upload_avatar(user_id: int, file: UploadFile, db: Session):
        return UserService.save_avatar(db, user_id, file)

    @staticmethod
    def delete(user_id: int, db: Session):
        return UserService.delete(db, user_id)