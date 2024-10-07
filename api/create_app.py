"""Create API app."""

from __future__ import annotations

import contextlib
import logging
import typing as t

import fastapi
from fastapi import Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi_nextauth_jwt.exceptions import MissingTokenError

import config
import db_connection

from .routers import auth, state, task, user, owner, task_device_location, task_qrcode, log
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("app")
logging.basicConfig(format="%(levelname)s:  %(message)s", level=logging.DEBUG)
logging.getLogger("multipart").setLevel(logging.ERROR)

def create_app(
        *,
        settings: config.Settings | None = None
) -> fastapi.FastAPI:
    """Create API app."""
    if settings is None:
        settings = config.get_dev_settings()

    logger.debug("Create lifespan handler.")

    @contextlib.asynccontextmanager
    async def lifespan_handler(app: fastapi.FastAPI) -> t.AsyncIterator[None]:
        logger.debug("Start lifespan handler.")
        db_conn = db_connection.create_mysql_connection()
        async with db_conn as conn, conn.cursor() as cursor:
            await cursor.execute("use reparaturcafe;")

        yield

    logger.debug("Create app object.")
    app = fastapi.FastAPI(
        title="Reparaturcafe",
        lifespan=lifespan_handler,
        root_path="/fastapi",
        swagger_ui_parameters={
            "persistAuthorization": True
        }
    )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        exc_str = f'{exc}'.replace('\n', ' ').replace('   ', ' ')
        logging.error(f"{request}: {exc_str}")
        content = {'status_code': 10422, 'message': exc_str, 'data': None}
        return JSONResponse(content=content, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)
    
    @app.exception_handler(MissingTokenError)
    async def validation_exception_handler_missing_token(request: Request, exc: MissingTokenError):
        content = {'status_code': 10422, 'message': "Session cookie is missing.", 'data': None}
        return JSONResponse(content=content, status_code=status.HTTP_401_UNAUTHORIZED)

    app.include_router(auth.router)
    app.include_router(user.router)
    app.include_router(task.router)
    app.include_router(state.router)
    app.include_router(task_device_location.router)
    app.include_router(owner.router)
    app.include_router(task_qrcode.router)
    app.include_router(log.router)

    logger.debug("Return app.")
    return app
