from pydantic import BaseModel, EmailStr, Field


class FeedbackSchema(BaseModel):
    sender_email: EmailStr | None = None
    message: str = Field(min_length=1, max_length=5000)