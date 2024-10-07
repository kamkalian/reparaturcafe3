from __future__ import annotations

import typing as t

import fastapi

from api.auth import get_current_active_user
from api.models.task import PayloadTaskDeviceLocationUpdate
from api.db_queries.tasks import query_update_device_location
from api.dependencies.db import get_db_connection

if t.TYPE_CHECKING:
    import api.typing.db as db_types

router = fastapi.APIRouter(tags=["Location"], prefix="/location")


@router.patch("/update/{task_id}")
async def update_device_location(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    task_id: int,
    task_device_location_payload: PayloadTaskDeviceLocationUpdate,
    current_active_user=fastapi.Depends(get_current_active_user),
) -> None:
    await query_update_device_location(
        db_conn=db_conn,
        task_id=task_id,
        task_device_location_payload=task_device_location_payload
    )
    await db_conn.connection.commit()
