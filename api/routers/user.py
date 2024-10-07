"""User roures."""

from __future__ import annotations

import typing as t

import datetime as dt
from datetime import timedelta
from typing import Annotated

import fastapi
from fastapi import Depends, status

from api.auth import get_current_active_user
from api.models.user import PayloadUserCreate, PayloadUserUpdate, UserFull, UserBase
from api.db_queries.users import query_get_user_by_id, query_get_users, query_insert_user, query_update_user
from api.dependencies.db import get_db_connection

if t.TYPE_CHECKING:
    import api.typing.db as db_types

router = fastapi.APIRouter(tags=["User"], prefix="/user")


@router.get("/uhrzeit")
async def uhrzeit():
    return (dt.datetime.utcnow() + timedelta(hours=2)).strftime("%H:%M")


@router.get("/me", response_model=UserFull)
async def read_users_me(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    current_user: Annotated[UserFull, Depends(get_current_active_user)],
):
    return await query_get_user_by_id(db_conn=db_conn, user_id=current_user.id)


@router.get("/all", response_model=list[UserFull])
async def get_all_users(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    current_user: Annotated[UserFull, Depends(get_current_active_user)],
):
    return await query_get_users(db_conn=db_conn)


@router.post("/create")
async def create_user(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    user_payload: PayloadUserCreate,
    current_user: Annotated[UserBase, Depends(get_current_active_user)],
) -> int:
    new_user_id = await query_insert_user(db_conn=db_conn, user_payload=user_payload)
    await db_conn.connection.commit()
    return new_user_id


@router.patch("/update/{user_id}")
async def update_user(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    user_id: int,
    user_payload: PayloadUserUpdate,
    current_user: Annotated[UserBase, Depends(get_current_active_user)],
) -> None:
    user: UserFull | None = await query_get_user_by_id(db_conn=db_conn, user_id=user_id)
    if user is None:
        raise fastapi.HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="User not found."
        )
    await query_update_user(db_conn=db_conn, user_id=user_id, user_payload=user_payload)
    await db_conn.connection.commit()
