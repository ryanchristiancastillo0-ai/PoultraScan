from fastapi import HTTPException, status

from schemas.feedback_schema import FeedbackSchema
from services.email_service import EmailService


class FeedbackController:

    @staticmethod
    def submit(payload: FeedbackSchema):
        try:
            EmailService.send_feedback(payload.message, payload.sender_email)
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Feedback could not be sent right now. Please try again later.",
            ) from exc
        return {"message": "Feedback sent successfully"}