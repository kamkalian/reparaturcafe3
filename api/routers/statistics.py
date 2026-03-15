"""Statistics API router."""
from __future__ import annotations

import typing as t

import fastapi

from api.auth import get_current_active_user
from api.models.statistics import (
    StatisticsResponse,
    TasksPerMonth,
    OldestOpenTask,
    ManufacturerStat,
    ManufacturerTaskItem,
    ManufacturerSuggestion,
    PayloadUpdateManufacturer,
    ManufacturerSimilarPair,
    PayloadBulkRenameManufacturer,
    ManufacturerTrend,
)
from api.db_queries.statistics import (
    query_get_all_statistics,
    query_get_tasks_per_month,
    query_get_oldest_open_tasks,
    query_get_tasks_by_manufacturer,
    query_update_manufacturer,
    query_get_manufacturer_suggestions,
    query_get_similar_manufacturer_pairs,
    query_bulk_rename_manufacturer,
    query_get_manufacturer_trends,
)
from api.dependencies.db import get_db_connection

if t.TYPE_CHECKING:
    import api.typing.db as db_types

router = fastapi.APIRouter(tags=["Statistics"], prefix="/statistics")


@router.get(
    "/all",
    response_model=StatisticsResponse,
    dependencies=[fastapi.Depends(get_current_active_user)],
)
async def get_statistics(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    from_year: int | None = fastapi.Query(None),
    from_month: int | None = fastapi.Query(None),
    to_year: int | None = fastapi.Query(None),
    to_month: int | None = fastapi.Query(None),
) -> StatisticsResponse:
    """Return all statistics: tasks per month, open-time, manufacturers."""
    return await query_get_all_statistics(
        db_conn=db_conn,
        from_year=from_year,
        from_month=from_month,
        to_year=to_year,
        to_month=to_month,
    )


@router.get(
    "/tasks_per_month",
    response_model=list[TasksPerMonth],
    dependencies=[fastapi.Depends(get_current_active_user)],
)
async def get_tasks_per_month(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    from_year: int | None = fastapi.Query(None),
    from_month: int | None = fastapi.Query(None),
    to_year: int | None = fastapi.Query(None),
    to_month: int | None = fastapi.Query(None),
) -> list[TasksPerMonth]:
    """Return tasks per month, optionally filtered by date range. Gaps are filled with count=0."""
    return await query_get_tasks_per_month(
        db_conn=db_conn,
        from_year=from_year,
        from_month=from_month,
        to_year=to_year,
        to_month=to_month,
    )


@router.get(
    "/oldest_open_tasks",
    response_model=list[OldestOpenTask],
    dependencies=[fastapi.Depends(get_current_active_user)],
)
async def get_oldest_open_tasks(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
) -> list[OldestOpenTask]:
    """Return the 10 oldest tasks open >100 days, with last comment date."""
    return await query_get_oldest_open_tasks(db_conn=db_conn)


@router.get(
    "/manufacturer_trends",
    response_model=list[ManufacturerTrend],
    dependencies=[fastapi.Depends(get_current_active_user)],
)
async def get_manufacturer_trends(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    from_year: int | None = fastapi.Query(None),
    from_month: int | None = fastapi.Query(None),
    to_year: int | None = fastapi.Query(None),
    to_month: int | None = fastapi.Query(None),
) -> list[ManufacturerTrend]:
    """Return monthly task counts for the top 10 manufacturers."""
    return await query_get_manufacturer_trends(
        db_conn=db_conn,
        from_year=from_year,
        from_month=from_month,
        to_year=to_year,
        to_month=to_month,
    )


@router.get(
    "/manufacturer_tasks",
    response_model=list[ManufacturerTaskItem],
    dependencies=[fastapi.Depends(get_current_active_user)],
)
async def get_manufacturer_tasks(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    manufacturer: str = fastapi.Query(...),
) -> list[ManufacturerTaskItem]:
    """Return all tasks for a given manufacturer name."""
    return await query_get_tasks_by_manufacturer(db_conn=db_conn, manufacturer=manufacturer)


@router.get(
    "/manufacturer_suggestions",
    response_model=list[ManufacturerSuggestion],
    dependencies=[fastapi.Depends(get_current_active_user)],
)
async def get_manufacturer_suggestions(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
    q: str = fastapi.Query(..., min_length=1),
) -> list[ManufacturerSuggestion]:
    """Return fuzzy-matched suggestions for a manufacturer name."""
    return await query_get_manufacturer_suggestions(db_conn=db_conn, query=q)


@router.patch(
    "/tasks/{task_id}/manufacturer",
    dependencies=[fastapi.Depends(get_current_active_user)],
)
async def update_task_manufacturer(
    task_id: int,
    payload: PayloadUpdateManufacturer,
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
) -> dict:
    """Update the manufacturer field for a single task."""
    await query_update_manufacturer(db_conn=db_conn, task_id=task_id, manufacturer=payload.manufacturer)
    await db_conn.connection.commit()
    return {"ok": True}


@router.get(
    "/manufacturer_similar_pairs",
    response_model=list[ManufacturerSimilarPair],
    dependencies=[fastapi.Depends(get_current_active_user)],
)
async def get_manufacturer_similar_pairs(
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
) -> list[ManufacturerSimilarPair]:
    """Return pairs of similar manufacturer names as merge suggestions."""
    return await query_get_similar_manufacturer_pairs(db_conn=db_conn)


@router.post(
    "/manufacturer_bulk_rename",
    dependencies=[fastapi.Depends(get_current_active_user)],
)
async def bulk_rename_manufacturer(
    payload: PayloadBulkRenameManufacturer,
    db_conn: db_types.DBConnection = fastapi.Depends(get_db_connection),
) -> dict:
    """Rename all tasks of source manufacturer to target."""
    count = await query_bulk_rename_manufacturer(
        db_conn=db_conn, source=payload.source, target=payload.target
    )
    await db_conn.connection.commit()
    return {"ok": True, "updated": count}
