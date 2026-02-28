from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://postgres:postgres@db:5432/tasktracker"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
