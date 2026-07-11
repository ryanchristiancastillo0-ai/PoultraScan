from sqlalchemy.orm import Session
from fastapi import status
from fastapi.responses import JSONResponse

from services.journal_entry_service import JournalEntryService
from schemas.journal_entry_schema import (
    CreateJournalEntrySchema,
    UpdateJournalEntrySchema,
    JournalEntryResponseSchema
)


class JournalEntryController:

    @staticmethod
    def create(user_id: int, data: CreateJournalEntrySchema, db: Session):
        entry = JournalEntryService.create(db, user_id, data)
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={
                "message": "Journal entry created successfully",
                "entry": JournalEntryResponseSchema.model_validate(entry).model_dump(mode="json")
            }
        )

    @staticmethod
    def get_by_id(user_id: int, entry_id: int, db: Session):
        entry = JournalEntryService.find_by_id(db, user_id, entry_id)
        return JournalEntryResponseSchema.model_validate(entry)

    @staticmethod
    def get_all(user_id: int, skip: int, limit: int, db: Session):
        entries = JournalEntryService.get_all_for_user(db, user_id, skip, limit)
        return [JournalEntryResponseSchema.model_validate(e) for e in entries]

    @staticmethod
    def get_by_farm(user_id: int, farm_id: int, skip: int, limit: int, db: Session):
        entries = JournalEntryService.get_by_farm(db, user_id, farm_id, skip, limit)
        return [JournalEntryResponseSchema.model_validate(e) for e in entries]

    @staticmethod
    def update(user_id: int, entry_id: int, data: UpdateJournalEntrySchema, db: Session):
        entry = JournalEntryService.update(db, user_id, entry_id, data)
        return JournalEntryResponseSchema.model_validate(entry)

    @staticmethod
    def delete(user_id: int, entry_id: int, db: Session):
        JournalEntryService.delete(db, user_id, entry_id)
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)