import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import Task, User
from app.schemas import TaskCreate, TaskUpdate, UserCreate, UserUpdate


# ── Users ─────────────────────────────────────────────────────────────────────

async def get_users(db: AsyncSession) -> list[User]:
    result = await db.execute(select(User).order_by(User.name))
    return list(result.scalars().all())


async def get_user(db: AsyncSession, user_id: uuid.UUID) -> User | None:
    return await db.get(User, user_id)


async def create_user(db: AsyncSession, data: UserCreate) -> User:
    user = User(name=data.name)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def update_user(db: AsyncSession, user: User, data: UserUpdate) -> User:
    user.name = data.name
    await db.commit()
    await db.refresh(user)
    return user


async def delete_user(db: AsyncSession, user: User) -> None:
    await db.delete(user)
    await db.commit()


# ── Tasks ─────────────────────────────────────────────────────────────────────

_task_options = [
    selectinload(Task.creator),
    selectinload(Task.updater),
]


async def get_tasks(db: AsyncSession) -> list[Task]:
    result = await db.execute(
        select(Task).options(*_task_options).order_by(Task.created_at.desc())
    )
    return list(result.scalars().all())


async def get_task(db: AsyncSession, task_id: uuid.UUID) -> Task | None:
    result = await db.execute(
        select(Task).options(*_task_options).where(Task.id == task_id)
    )
    return result.scalar_one_or_none()


async def create_task(db: AsyncSession, data: TaskCreate) -> Task:
    task = Task(
        title=data.title,
        description=data.description,
        created_by=data.created_by,
    )
    db.add(task)
    await db.commit()
    return await get_task(db, task.id)


async def update_task(db: AsyncSession, task: Task, data: TaskUpdate) -> Task:
    if data.title is not None:
        task.title = data.title
    if data.description is not None:
        task.description = data.description
    task.updated_by = data.updated_by
    from sqlalchemy import text
    await db.execute(
        text("UPDATE tasks SET updated_at = now() WHERE id = :id"),
        {"id": task.id},
    )
    await db.commit()
    return await get_task(db, task.id)


async def delete_task(db: AsyncSession, task: Task) -> None:
    await db.delete(task)
    await db.commit()
