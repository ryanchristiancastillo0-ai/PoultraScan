from fastapi import APIRouter, Depends

from controllers.feedback_controller import FeedbackController
from schemas.feedback_schema import FeedbackSchema

router = APIRouter(
    prefix="/api",
    tags=["Feedback"]
)


@router.post("/feedback")
def submit_feedback(payload: FeedbackSchema):
    return FeedbackController.submit(payload)