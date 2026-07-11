from datetime import timedelta
from sqlalchemy.orm import Session
from fastapi import status, Response
from fastapi.responses import JSONResponse
from utils.jwt_handler import ACCESS_TOKEN_EXPIRE_MINUTES
from services.user_service import UserService
from services.notification_service import NotificationService
from utils.google_auth import get_google_user_info
from utils.jwt_handler import create_access_token
from schemas.user_schema import (
    RegisterUserSchema,
    LoginUserSchema,
    UserResponseSchema,
    ForgotPasswordSchema,
    ResetPasswordSchema,
)
from schemas.notification_schema import CreateNotificationSchema

REMEMBER_ME_EXPIRE_DAYS = 30
DEFAULT_SESSION_MAX_AGE = ACCESS_TOKEN_EXPIRE_MINUTES * 60  # matches the JWT's exp
REMEMBER_ME_MAX_AGE = 60 * 60 * 24 * REMEMBER_ME_EXPIRE_DAYS


class AuthController:

    @staticmethod
    def register(user: RegisterUserSchema, db: Session):
        new_user = UserService.register(db, user)
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={
                "message": "User registered successfully",
                "user": UserResponseSchema.model_validate(new_user).model_dump(mode="json")
            }
        )

    @staticmethod
    def login(credentials: LoginUserSchema, db: Session):
        user = UserService.verify_login(db, credentials.email, credentials.password)

        if credentials.remember_me:
            token = UserService.generate_token_for_user(
                user, expires_delta=timedelta(days=REMEMBER_ME_EXPIRE_DAYS)
            )
            cookie_max_age = REMEMBER_ME_MAX_AGE
        else:
            token = UserService.generate_token_for_user(user)
            cookie_max_age = DEFAULT_SESSION_MAX_AGE

        NotificationService.create(db, CreateNotificationSchema(
            user_id=user.id,
            title="Logged in",
            message=f"You logged in as {user.username}."
        ))

        response = JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Login successful"}
        )
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            samesite="none",
            secure=True,
            max_age=cookie_max_age
        )
        return response

    @staticmethod
    def logout(response: Response, user_id: int, db: Session):
        NotificationService.create(db, CreateNotificationSchema(
            user_id=user_id,
            title="Logged out",
            message="You logged out."
        ))
        response.delete_cookie(
            "access_token",
            httponly=True,
            samesite="none",
            secure=True,
        )
        return {"message": "Logout successful"}

    @staticmethod
    def get_current(user_id: int, db: Session):
        user = UserService.find_by_id(db, user_id)
        return UserResponseSchema.model_validate(user)

    @staticmethod
    def forgot_password(payload: ForgotPasswordSchema, db: Session):
        token = UserService.create_reset_token(db, payload.email)

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "message": "If that email exists, a reset link has been generated.",
                "reset_token": token,
            }
        )

    @staticmethod
    def reset_password(payload: ResetPasswordSchema, db: Session):
        UserService.reset_password_with_token(db, payload.token, payload.new_password)
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Password reset successfully"}
        )

    @staticmethod
    async def google_login(credential: str, db: Session):
        # `credential` here is the Google access_token from useGoogleLogin (not an ID token)
        userinfo = await get_google_user_info(credential)
        user = UserService.find_or_create_google_user(
            db,
            email=userinfo["email"],
            fullname=userinfo.get("name", ""),
            avatar_url=userinfo.get("picture"),
        )
        token = UserService.generate_token_for_user(user)

        NotificationService.create(db, CreateNotificationSchema(
            user_id=user.id,
            title="Logged in",
            message=f"You logged in as {user.username}."
        ))

        response = JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Login successful"}
        )
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            samesite="none",
            secure=True,
            max_age=DEFAULT_SESSION_MAX_AGE
        )
        return response