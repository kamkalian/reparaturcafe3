from __future__ import annotations

import typing as t

from datetime import datetime, timedelta, timezone
from typing import Annotated

import fastapi
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext

from api import config
from api.models.user import UserInDB, UserBase
from api.db_queries.users import query_get_user_by_username
from api.dependencies.db import get_db_connection

from fastapi_nextauth_jwt import NextAuthJWTv4 # type: ignore


if t.TYPE_CHECKING:
    import api.typing.db as db_types

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


async def get_user(
        db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
        *,
        username: str
) -> UserInDB:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authentication": "Bearer"},
    )
    user = await query_get_user_by_username(db_conn=db_conn, username=username)
    if user is None:
        raise credentials_exception
    return user


JWT = NextAuthJWTv4(
        secret=config.SECRET_KEY,
    )

async def get_current_user(
        db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
        *,
        token: Annotated[str, Depends(oauth2_scheme)],
) -> UserBase:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authentication": "Bearer"},
    )
    payload = None
    try:
        payload = jwt.decode(
            jwt=token,
            key=config.SECRET_KEY,
            algorithms=[config.ALGORITHM]
        )
    except InvalidTokenError:
        raise credentials_exception
    
    if payload is None:
        raise credentials_exception

    username = payload["sub"]
    
    if username is None:
        raise credentials_exception

    user = await get_user(db_conn=db_conn, username=username)
    if user is None:
        raise credentials_exception
    return user



async def get_current_active_user(
    current_user: Annotated[UserBase, Depends(get_current_user)],
) -> UserBase:
    if not current_user.active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )
    return current_user


async def authenticate_user(
        db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
        *,
        username: str,
        password: str,
) -> UserInDB:
    user = await get_user(
        db_conn=db_conn, 
        username=username
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials"
        )
    if not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials"
        )
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, config.SECRET_KEY, algorithm=config.ALGORITHM)
    return encoded_jwt
