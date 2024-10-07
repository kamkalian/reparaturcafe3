from __future__ import annotations

import typing as t
import fastapi

from api.auth import get_current_active_user
from api.models.task import State, NextStep
from api.db_queries.tasks import query_update_state, query_update_next_step
from api.dependencies.db import get_db_connection

if t.TYPE_CHECKING:
    import api.typing.db as db_types

router = fastapi.APIRouter(tags=["State"], prefix="/state")


@router.patch("/update_state/{task_id}")
async def update_task_state(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    task_id: int,
    task_state: State,
    current_active_user=fastapi.Depends(get_current_active_user),
) -> None:
    await query_update_state(db_conn=db_conn, task_id=task_id, task_state=task_state)
    await db_conn.connection.commit()


@router.patch("/update_next_step/{task_id}")
async def update_task_next_step(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    *,
    task_id: int,
    task_next_step: NextStep,
    current_active_user=fastapi.Depends(get_current_active_user),
) -> None:
    await query_update_next_step(db_conn=db_conn, task_id=task_id, task_next_step=task_next_step)
    await db_conn.connection.commit()