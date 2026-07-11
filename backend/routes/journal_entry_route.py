from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from controllers.journal_entry_controller import JournalEntryController
from schemas.journal_entry_schema import CreateJournalEntrySchema, UpdateJournalEntrySchema
from middleware.auth_middleware import get_current_user_id

router = APIRouter(
    prefix="/api/journal-entries",
    tags=["Journal Entries"]
)


@router.post("/")
def create_journal_entry(
    data: CreateJournalEntrySchema,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return JournalEntryController.create(current_user_id, data, db)


@router.get("/")
def get_my_journal_entries(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return JournalEntryController.get_all(current_user_id, skip, limit, db)


@router.get("/farm/{farm_id}")
def get_journal_entries_by_farm(
    farm_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return JournalEntryController.get_by_farm(current_user_id, farm_id, skip, limit, db)


@router.get("/{entry_id}")
def get_journal_entry_by_id(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return JournalEntryController.get_by_id(current_user_id, entry_id, db)


@router.put("/{entry_id}")
def update_journal_entry(
    entry_id: int,
    data: UpdateJournalEntrySchema,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return JournalEntryController.update(current_user_id, entry_id, data, db)


@router.delete("/{entry_id}")
def delete_journal_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return JournalEntryController.delete(current_user_id, entry_id, db)