from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from controllers.activity_log_controller import ActivityLogController
from schemas.activity_log_schema import CreateActivityLogSchema
from middleware.auth_middleware import get_current_user_id

router = APIRouter(
    prefix="/activity-logs",
    tags=["Activity Logs"]
)


@router.post("/")
def create_activity_log(
    data: CreateActivityLogSchema,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return ActivityLogController.create(data, db)


@router.get("/user/{user_id}")
def get_activity_logs_by_user(
    user_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return ActivityLogController.get_by_user_id(user_id, skip, limit, db)


@router.get("/{log_id}")
def get_activity_log_by_id(
    log_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return ActivityLogController.get_by_id(log_id, db)


@router.get("/")
def get_all_activity_logs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return ActivityLogController.get_all(skip, limit, db)


@router.delete("/{log_id}")
def delete_activity_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return ActivityLogController.delete(log_id, db)