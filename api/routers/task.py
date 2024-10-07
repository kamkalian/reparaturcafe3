from __future__ import annotations

import typing as t

import fastapi
from fastapi import Depends
from typing import Annotated

from api.auth import get_current_active_user
from api.models.user import UserFull
from api.models.task import (
    PayloadTaskCreate,
    TaskFull,
    TaskFullWithSupervisorName,
    TaskSimple,
    PayloadTaskSupervisorUpdate,
    PayloadTaskOwnerUpdate,
    PayloadTaskDeviceUpdate,
    PayloadTaskSearch
)
from api.db_queries.tasks import (
    query_get_tasks,
    query_insert_task,
    query_get_task_by_id,
    query_get_simple_tasks,
    query_update_supervisor,
    query_update_owner,
    query_update_device,
    query_get_task_by_search
)
from api.dependencies.db import get_db_connection

if t.TYPE_CHECKING:
    import api.typing.db as db_types

router = fastapi.APIRouter(tags=["Tasks"], prefix="/task")


@router.post("/create")
async def task_create(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    task_payload: PayloadTaskCreate,
    current_active_user=fastapi.Depends(get_current_active_user),
) -> int:
    new_task_id = await query_insert_task(db_conn=db_conn, task_payload=task_payload)
    await db_conn.connection.commit()
    return new_task_id


@router.get(
    "/get_by_id/{task_id}",
    response_model=TaskFullWithSupervisorName,
    dependencies=[fastapi.Depends(get_current_active_user)],
)
async def get_task_by_id(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    task_id: int,
    current_active_user=fastapi.Depends(get_current_active_user),
) -> TaskFullWithSupervisorName:
    task = await query_get_task_by_id(db_conn=db_conn, task_id=task_id)
    if task is None:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_404_NOT_FOUND, detail="Task not found"
        )
    return task


@router.get(
    "/all",
    response_model=list[TaskFull],
    dependencies=[fastapi.Depends(get_current_active_user)],
)
async def get_task_list(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    search_term: str | None = None,
    new: str | None = None,
    in_process: str | None = None,
    done: str | None = None,
    completed: str | None = None,
) -> t.Generator[TaskFull] | None:
    state_filters: list[str] = []
    if new is not None:
        state_filters.append("new")
    if in_process is not None:
        state_filters.append("in_process")
    if done is not None:
        state_filters.append("done")
    if completed is not None:
        state_filters.append("completed")
    return await query_get_tasks(
        db_conn=db_conn,
        search_term=search_term,
        state_filters=state_filters)


@router.get(
    "/simple_list",
    response_model=list[TaskSimple],
    dependencies=[fastapi.Depends(get_current_active_user)],
)
async def get_simple_task_list(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    current_active_user=fastapi.Depends(get_current_active_user),
) -> t.Generator[TaskSimple] | None:
    return await query_get_simple_tasks(db_conn=db_conn)


@router.patch("/update_device/{task_id}")
async def update_device(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    task_id: int,
    task_device_payload: PayloadTaskDeviceUpdate,
    current_active_user=fastapi.Depends(get_current_active_user),
) -> None:
    await query_update_device(db_conn=db_conn, task_id=task_id, task_device_payload=task_device_payload)
    await db_conn.connection.commit()


@router.patch("/update_supervisor/{task_id}")
async def update_supervisor(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    task_id: int,
    task_supervisor_payload: PayloadTaskSupervisorUpdate,
    current_active_user=fastapi.Depends(get_current_active_user),
) -> None:
    await query_update_supervisor(db_conn=db_conn, task_id=task_id, task_supervisor_payload=task_supervisor_payload)
    await db_conn.connection.commit()


@router.patch("/update_owner/{task_id}")
async def update_owner(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    task_id: int,
    task_owner_payload: PayloadTaskOwnerUpdate,
    current_active_user=fastapi.Depends(get_current_active_user),
) -> None:
    await query_update_owner(db_conn=db_conn, task_id=task_id, task_owner_payload=task_owner_payload)
    await db_conn.connection.commit()


@router.post("/search", response_model=list[TaskFull])
async def get_all_tasks_by_search(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    task_search_payload: PayloadTaskSearch,
    current_user: Annotated[UserFull, Depends(get_current_active_user)],
):
    return await query_get_task_by_search(db_conn=db_conn, search_payload=task_search_payload)
