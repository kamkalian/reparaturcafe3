from __future__ import annotations

import typing as t

from datetime import timedelta
from typing import Annotated

import fastapi
from fastapi import Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm

from api import config
from api.auth import authenticate_user, create_access_token
from api.db_queries.users import query_get_user_by_id
from api.models.user import Token

from api.dependencies.db import get_db_connection

if t.TYPE_CHECKING:
    import api.typing.db as db_types

router = fastapi.APIRouter(tags=["Auth"])


@router.post("/token")
async def login(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    response: Response
) -> Token:
    """Check user credentials and create access token."""
    user = await authenticate_user(
        db_conn=db_conn,
        username=form_data.username,
        password=form_data.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authentication": "Bearer"},
        )
    access_token_expires = timedelta(minutes=float(config.ACCESS_TOKEN_EXPIRE_MINUTES))
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )

    response.set_cookie(
        key="session",
        value=access_token,
        max_age=86400,
        secure=True,
        httponly=True,
        samesite="strict")
    return Token(access_token=access_token, token_type="bearer")


@router.post("/authenticate")
async def authenticate(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    """Check user credentials."""
    user = await authenticate_user(
        db_conn=db_conn,
        username=form_data.username,
        password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authentication": "Bearer"},
        )
    return await query_get_user_by_id(db_conn=db_conn, user_id=user.id)
