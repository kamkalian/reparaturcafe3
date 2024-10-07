"""User roures."""

from __future__ import annotations

import typing as t

from typing import Annotated

import fastapi
from fastapi import Depends, status

from api.auth import get_current_active_user
from api.models.user import UserBase, UserFull
from api.models.owner import PayloadOwnerCreate, PayloadOwnerUpdate, OwnerFull, PayloadOwnerSearch
from api.db_queries.owner import query_insert_owner, query_update_owner, query_get_owner_by_id, query_get_owners, query_get_owners_by_search
from api.dependencies.db import get_db_connection

if t.TYPE_CHECKING:
    import api.typing.db as db_types

router = fastapi.APIRouter(tags=["Owner"], prefix="/owner")


@router.post("/create")
async def create_owner(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    owner_payload: PayloadOwnerCreate,
    current_user: Annotated[UserBase, Depends(get_current_active_user)],
) -> int:
    new_owner_id = await query_insert_owner(db_conn=db_conn, owner_payload=owner_payload)
    await db_conn.connection.commit()
    return new_owner_id


@router.patch("/update/{owner_id}")
async def update_owner(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    owner_id: int,
    owner_payload: PayloadOwnerUpdate,
    current_user: Annotated[UserBase, Depends(get_current_active_user)],
) -> None:
    owner: OwnerFull = await query_get_owner_by_id(db_conn=db_conn, owner_id=owner_id)
    if owner is None:
        raise fastapi.HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Owner not found."
        )
    await query_update_owner(db_conn=db_conn, owner_id=owner_id, owner_payload=owner_payload)
    await db_conn.connection.commit()


@router.get(
    "/get_by_id/{owner_id}",
    response_model=OwnerFull,
    dependencies=[fastapi.Depends(get_current_active_user)]
)
async def get_owner_by_id(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    owner_id: int,
    current_user: Annotated[UserFull, Depends(get_current_active_user)],
):
    return await query_get_owner_by_id(db_conn=db_conn, owner_id=owner_id)


@router.get("/all", response_model=list[OwnerFull])
async def get_all_owners(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    current_user: Annotated[UserFull, Depends(get_current_active_user)],
):
    return await query_get_owners(db_conn=db_conn)


@router.post("/search", response_model=list[OwnerFull])
async def get_all_owners_by_search(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    owner_search_payload: PayloadOwnerSearch,
    current_user: Annotated[UserFull, Depends(get_current_active_user)],
):
    return await query_get_owners_by_search(db_conn=db_conn, search_payload=owner_search_payload)