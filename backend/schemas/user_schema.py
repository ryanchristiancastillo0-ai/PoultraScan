from pydantic import BaseModel, EmailStr
from datetime import datetime


class RegisterUserSchema(BaseModel):
    fullname: str
    username: str
    email: EmailStr
    password: str


class LoginUserSchema(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False


class GoogleLoginSchema(BaseModel):
    credential: str


class UpdateUserSchema(BaseModel):
    fullname: str | None = None
    email: EmailStr | None = None
    avatar_url: str | None = None


class UserResponseSchema(BaseModel):
    id: int
    fullname: str
    username: str
    email: EmailStr
    avatar_url: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class ForgotPasswordSchema(BaseModel):
    email: EmailStr


class ForgotPasswordResponseSchema(BaseModel):
    reset_token: str  # returned so the frontend can email it via EmailJS
    message: str


class ResetPasswordSchema(BaseModel):
    token: str
    new_password: str