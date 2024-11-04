from __future__ import annotations

import typing as t
from datetime import timedelta

import fastapi
import io
from starlette.responses import StreamingResponse
import qrcode
import qrcode.image.svg



from api.dependencies.db import get_db_connection

if t.TYPE_CHECKING:
    import api.typing.db as db_types

router = fastapi.APIRouter(tags=["QRCode"], prefix="/qrcode")


@router.post("/create")
async def qrcode_create(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    task_id: int,
) -> StreamingResponse:
    img = qrcode.make("https://reparaturcafe-dev.it-awo.de/task/"+str(task_id))
    buf = io.BytesIO()
    img.save(buf)
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/jpeg")





