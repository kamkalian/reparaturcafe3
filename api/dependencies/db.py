"""Database related dependencies."""

from __future__ import annotations

import contextlib
import logging
import db_connection

import api.typing.db as db_types

logger = logging.getLogger("app")


@contextlib.asynccontextmanager
async def _handle_mysql_connection_context():
    logger.debug("Create new MySQL DB connection.")
    async with db_connection.create_mysql_connection() as conn, conn.cursor() as cursor:
        try:
            conn_dict = db_types.DBConnection(
                connection=conn, cursor=cursor
            )
            yield conn_dict
        finally:
            logger.debug("Close MySQL DB connection")

    

async def get_db_connection():
    """Get a connection for the database."""
    async with _handle_mysql_connection_context() as db_conn:
        yield db_conn

