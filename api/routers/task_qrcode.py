from __future__ import annotations

import typing as t

import fastapi
import io
from starlette.responses import StreamingResponse
import qrcode
import qrcode.image.svg
from PIL import Image
from PIL import ImageFont
from PIL import ImageDraw
from api import config


from api.auth import get_current_active_user
from api.db_queries.qrcode import query_complete_print_job, query_get_print_jobs, query_insert_print_job
from api.dependencies.db import get_db_connection
from api.models.qrcode import PayloadPrintJob
from api.models.user import UserFull

if t.TYPE_CHECKING:
    import api.typing.db as db_types

router = fastapi.APIRouter(tags=["QRCode"], prefix="/qrcode")


@router.get("/create")
async def qrcode_create(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    task_id: int,
) -> StreamingResponse:
    img = qrcode.make(config.NEXT_PUBLIC_API_URL+"/task/"+str(task_id))
    buf = io.BytesIO()
    img.save(buf)
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/jpeg")


@router.get("/create_label")
async def label_create(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    task_id: int,
) -> StreamingResponse:
    
    label_image = Image.new(mode="RGB", size=(696, 200), color="white")
    
    awo_logo = Image.open("public/images/awo-logo.png")
    awo_logo = awo_logo.resize((140, 120))

    qrcode_image = qrcode.make(config.NEXT_PUBLIC_API_URL+"/task/"+str(task_id))
    qrcode_image = qrcode_image.resize((180, 180))

    label_image.paste(qrcode_image, (10, 10))
    label_image.paste(awo_logo, (520, 40), awo_logo)

    draw = ImageDraw.Draw(label_image)
    font = ImageFont.load_default(40)
    font
    draw.text((210, 30),"ID: " + str(task_id), font=font, fill=(0,0,0))
    draw.text((210, 80),"ReparaturCafe", font=font, fill=(0,0,0))
    draw.text((210, 130),"AWO Oberlar e.V.", font=font, fill=(0,0,0))


    buf = io.BytesIO()
    label_image.save(buf, "JPEG")
    buf.seek(0)

    return StreamingResponse(buf, media_type="image/jpeg")


@router.post("/print")
async def qrcode_print(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    task_id: int,
):
    await query_insert_print_job(db_conn=db_conn, task_id=task_id)
    await db_conn.connection.commit()


@router.patch("/complete")
async def complete_qrcode_print(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    qrcode_id: int,
):
    await query_complete_print_job(db_conn=db_conn, qrcode_id=qrcode_id)
    await db_conn.connection.commit()


@router.get("/all", response_model=list[PayloadPrintJob], dependencies=[fastapi.Depends(get_current_active_user)])
async def get_all_print_jobs(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    current_user: t.Annotated[UserFull, fastapi.Depends(get_current_active_user)],
):
    print_jobs: list[PayloadPrintJob] = await query_get_print_jobs(db_conn=db_conn)
    for job in print_jobs:
        await complete_qrcode_print(db_conn=db_conn, qrcode_id=job.id)
    return print_jobs





