# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Run the dev server (auto-reload on changes)
uvicorn main:app --reload

# API docs available at runtime
# http://localhost:8000/docs
# http://localhost:8000/redoc
```

The database (`tasks.db`) is created automatically on first startup — no migration step needed.

## Architecture

Full-stack app with a FastAPI backend and vanilla JS frontend. No build tools.

**Backend layout:**
- `main.py` — app entry point; registers CORS middleware, mounts routers, creates DB tables
- `app/routers/tasks.py` — REST endpoints for Task CRUD (`/tasks/`)
- `app/crud.py` — all DB interactions (called by routers)
- `app/models.py` — SQLAlchemy ORM model (`Task`)
- `app/schemas.py` — Pydantic schemas for request/response validation (`TaskCreate`, `TaskUpdate`, `TaskResponse`)
- `app/database.py` — SQLite engine, `SessionLocal`, `get_db()` dependency

**Frontend layout (`frontend/`):**
- `index.html` + `game.js` — standalone Tic Tac Toe game (no API calls)
- `tasks.html` + `tasks.js` — task viewer that fetches from `http://localhost:8000/tasks/?limit=100`
- `style.css` — shared dark theme styles; `tasks.css` — table-specific styles

The frontend and backend are decoupled: the frontend makes raw `fetch()` calls to the API. CORS is wide open (all origins).
