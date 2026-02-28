from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app import models
from app.routers import tasks

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Tasks API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router)


@app.get("/")
def root():
    return {"message": "Tasks API is running", "docs": "/docs"}
