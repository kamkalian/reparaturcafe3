from __future__ import annotations

import typing as t

import fastapi
from fastapi.responses import JSONResponse

from api.auth import get_current_active_user
from api.db_queries.log import query_get_logs_from_task, query_insert_log_record, query_update_log_image_url
from api.models.log import PayloadLogRecordCreate, PayloadLog
from api.dependencies.db import get_db_connection

if t.TYPE_CHECKING:
    import api.typing.db as db_types

router = fastapi.APIRouter(tags=["Log"], prefix="/log")


@router.get("/all/{task_id}", response_model=list[PayloadLog])
async def get_all_logs(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    task_id: int,
    current_active_user=fastapi.Depends(get_current_active_user),
):
    return await query_get_logs_from_task(db_conn=db_conn, task_id=task_id)


@router.post("/create_record")
async def create_comment(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    log_payload: PayloadLogRecordCreate,
    current_active_user=fastapi.Depends(get_current_active_user),
) -> JSONResponse:
    log_id = await query_insert_log_record(db_conn=db_conn, log_payload=log_payload)
    await db_conn.connection.commit()
    return JSONResponse({"id": log_id})


@router.post("/set_image_url/{log_id}")
async def set_image_url(
    log_id: int,
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    current_active_user=fastapi.Depends(get_current_active_user),
    payload: dict = fastapi.Body(...),
) -> JSONResponse:
    image_url = payload.get("image_url")
    if not image_url:
        raise fastapi.HTTPException(status_code=400, detail="image_url fehlt.")
    await query_update_log_image_url(db_conn=db_conn, log_id=log_id, image_url=image_url)
    await db_conn.connection.commit()
    return JSONResponse({"ok": True})

