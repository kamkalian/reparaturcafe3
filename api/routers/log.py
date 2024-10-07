from __future__ import annotations

import typing as t
import fastapi

from api.auth import get_current_active_user
from api.db_queries.log import query_get_logs_from_task, query_insert_log_record
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
) -> None:
    await query_insert_log_record(
        db_conn=db_conn,
        log_payload=PayloadLogRecordCreate(
            comment=log_payload.comment,
            supervisor_id=log_payload.supervisor_id,
            task_id=log_payload.task_id,
            record_type=log_payload.record_type  
        ))
    await db_conn.connection.commit()
