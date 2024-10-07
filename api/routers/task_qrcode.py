from __future__ import annotations

import typing as t
from datetime import timedelta

import fastapi
import io
from fastapi import Depends
from fastapi.responses import FileResponse
from api import config
from api.auth import create_access_token
from starlette.responses import StreamingResponse
from typing import Annotated, Union
import qrcode
import qrcode.image.svg
from jose import JWTError, jwt

from api.auth import get_current_active_user
from api.models.user import UserFull, Token
from api.models.task import (
    PayloadTaskCreate,
    TaskFull,
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

router = fastapi.APIRouter(tags=["QRCode"], prefix="/qrcode")


@router.post("/create")
async def qrcode_create(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    task_id: int,
    current_active_user=fastapi.Depends(get_current_active_user),
) -> StreamingResponse:
    img = qrcode.make("https://reparaturcafe-dev.it-awo.de/task/"+str(task_id))
    buf = io.BytesIO()
    img.save(buf)
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/jpeg")





