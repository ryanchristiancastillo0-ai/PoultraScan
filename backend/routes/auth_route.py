from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from database.database import get_db
from controllers.auth_controller import AuthController
from schemas.user_schema import (
    RegisterUserSchema,
    LoginUserSchema,
    ForgotPasswordSchema,
    ResetPasswordSchema,
    GoogleLoginSchema,
)
from middleware.auth_middleware import get_current_user_id

router = APIRouter(
    prefix="/api/auth",
    tags=["Auth"]
)


@router.post("/register")
def register(
    user: RegisterUserSchema,
    db: Session = Depends(get_db)
):
    return AuthController.register(user, db)


@router.post("/login")
def login(
    credentials: LoginUserSchema,
    db: Session = Depends(get_db)
):
    return AuthController.login(credentials, db)


@router.post("/logout")
def logout(
    response: Response,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return AuthController.logout(response, current_user_id, db)

@router.get("/me")
def get_current_user(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return AuthController.get_current(current_user_id, db)


@router.post("/forgot-password")
def forgot_password(
    payload: ForgotPasswordSchema,
    db: Session = Depends(get_db)
):
    return AuthController.forgot_password(payload, db)


@router.post("/reset-password")
def reset_password(
    payload: ResetPasswordSchema,
    db: Session = Depends(get_db)
):
    return AuthController.reset_password(payload, db)


@router.post("/google")
async def google_login(
    payload: GoogleLoginSchema,
    db: Session = Depends(get_db)
):
    return await AuthController.google_login(payload.credential, db)