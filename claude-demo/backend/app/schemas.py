import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


# ── User ──────────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    name: str


class UserUpdate(BaseModel):
    name: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str


# ── Task ──────────────────────────────────────────────────────────────────────

class TaskCreate(BaseModel):
    title: str
    description: str = ""
    created_by: uuid.UUID


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    updated_by: uuid.UUID


class TaskOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    description: str
    created_by: uuid.UUID
    created_at: datetime
    updated_by: uuid.UUID | None
    updated_at: datetime | None
    creator: UserOut
    updater: UserOut | None
