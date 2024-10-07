from __future__ import annotations

import typing as t
from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv

load_dotenv()


class MySQLSettings(BaseSettings):
    """MySQL settings."""

    DB_MYSQL_HOST: str
    DB_MYSQL_PORT: int
    DB_MYSQL_DATABASE: str
    DB_MYSQL_USER: str
    DB_MYSQL_PASSWORD: str | None


class AuthSettings(BaseSettings):
    """Auth settings."""

    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int


class Settings(MySQLSettings, AuthSettings):
    """Application Settings protocol."""


def get_dev_settings():
    """Return Development settings."""

    return Settings(
        DB_MYSQL_HOST=os.getenv("DB_MYSQL_HOST", "localhost"),
        DB_MYSQL_PORT=os.getenv("DB_MYSQL_PORT", 3306),
        DB_MYSQL_DATABASE=os.getenv("DB_MYSQL_DATABASE", "reparaturcafe"),
        DB_MYSQL_USER=os.getenv("DB_MYSQL_USER", "oskar"),
        DB_MYSQL_PASSWORD=os.getenv("DB_MYSQL_PASSWORD", None),
        SECRET_KEY=os.getenv("SECRET_KEY", "1234567890"),
        ALGORITHM=os.getenv("ALGORITHM", "HS256"),
        ACCESS_TOKEN_EXPIRE_MINUTES=os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 1440),
    )


def get_prod_settings():
    """Return Production settings."""

    return Settings(
        DB_MYSQL_HOST=os.getenv("DB_MYSQL_HOST", "localhost"),
        DB_MYSQL_PORT=os.getenv("DB_MYSQL_PORT", 3306),
        DB_MYSQL_DATABASE=os.getenv("DB_MYSQL_DATABASE", "reparaturcafe"),
        DB_MYSQL_USER=os.getenv("DB_MYSQL_USER", "oskar"),
        DB_MYSQL_PASSWORD=os.getenv("DB_MYSQL_PASSWORD", None),
        SECRET_KEY=os.getenv("SECRET_KEY", "1234567890"),
        ALGORITHM=os.getenv("ALGORITHM", "HS256"),
        ACCESS_TOKEN_EXPIRE_MINUTES=os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 1440),
    )
