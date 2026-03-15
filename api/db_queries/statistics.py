"""Statistics database queries."""
from __future__ import annotations

import datetime
import typing as t

from api.models.statistics import (
    TasksPerMonth,
    OpenTimeStat,
    OpenTimeBucket,
    ManufacturerStat,
    ManufacturerTaskItem,
    ManufacturerSuggestion,
    OldestOpenTask,
    ManufacturerTrend,
    ManufacturerTrendPoint,
    StatisticsResponse,
)

if t.TYPE_CHECKING:
    import api.typing.db as db_types


def _fill_months(
    raw: list[TasksPerMonth],
    from_year: int,
    from_month: int,
    to_year: int,
    to_month: int,
) -> list[TasksPerMonth]:
    """Fill missing months with count=0 so the result covers every month in range."""
    data_map = {(d.year, d.month): d.count for d in raw}
    result: list[TasksPerMonth] = []
    year, month = from_year, from_month
    while (year < to_year) or (year == to_year and month <= to_month):
        result.append(TasksPerMonth(year=year, month=month, count=data_map.get((year, month), 0)))
        month += 1
        if month > 12:
            month = 1
            year += 1
    return result


async def query_get_tasks_per_month(
        db_conn: db_types.DBConnection,
        *,
        from_year: int | None = None,
        from_month: int | None = None,
        to_year: int | None = None,
        to_month: int | None = None,
) -> list[TasksPerMonth]:
    """Tasks created per calendar month, gaps filled with count=0."""
    conditions: list[str] = []
    params: list[int] = []

    if from_year is not None and from_month is not None:
        conditions.append(
            "(YEAR(creation_date) > %s OR (YEAR(creation_date) = %s AND MONTH(creation_date) >= %s))"
        )
        params.extend([from_year, from_year, from_month])
    if to_year is not None and to_month is not None:
        conditions.append(
            "(YEAR(creation_date) < %s OR (YEAR(creation_date) = %s AND MONTH(creation_date) <= %s))"
        )
        params.extend([to_year, to_year, to_month])

    where = ("WHERE " + " AND ".join(conditions)) if conditions else ""
    query_str = f"""
    SELECT
        YEAR(creation_date)  AS year,
        MONTH(creation_date) AS month,
        COUNT(*)             AS count
    FROM tasks
    {where}
    GROUP BY YEAR(creation_date), MONTH(creation_date)
    ORDER BY year, month;
    """
    try:
        await db_conn.cursor.execute(query_str, params if params else None)
        rows = await db_conn.cursor.fetchall()
        raw = [TasksPerMonth(year=row[0], month=row[1], count=row[2]) for row in rows]
    except Exception as e:
        print(e)
        raise

    if not raw:
        return []

    today = datetime.date.today()
    fy = from_year if from_year is not None else raw[0].year
    fm = from_month if from_month is not None else raw[0].month
    ty = to_year if to_year is not None else today.year
    tm = to_month if to_month is not None else today.month

    return _fill_months(raw, fy, fm, ty, tm)


async def query_get_open_time_stats(
        db_conn: db_types.DBConnection,
) -> OpenTimeStat:
    """Aggregate statistics: avg / min / max days open for non-completed tasks."""
    query_str = """
    SELECT
        AVG(DATEDIFF(NOW(), creation_date)) AS avg_days,
        MIN(DATEDIFF(NOW(), creation_date)) AS min_days,
        MAX(DATEDIFF(NOW(), creation_date)) AS max_days,
        COUNT(*)                            AS total_open
    FROM tasks
    WHERE task_state != 'completed';
    """
    try:
        await db_conn.cursor.execute(query_str)
        row = await db_conn.cursor.fetchone()
        if row is None or row[3] == 0:
            return OpenTimeStat(avg_days=None, min_days=None, max_days=None, total_open=0)
        return OpenTimeStat(
            avg_days=round(float(row[0]), 1) if row[0] is not None else None,
            min_days=int(row[1]) if row[1] is not None else None,
            max_days=int(row[2]) if row[2] is not None else None,
            total_open=int(row[3]),
        )
    except Exception as e:
        print(e)
        raise


async def query_get_open_time_distribution(
        db_conn: db_types.DBConnection,
) -> list[OpenTimeBucket]:
    """Distribution of currently open (non-completed) tasks grouped by duration buckets."""
    query_str = """
    SELECT
        CASE
            WHEN DATEDIFF(NOW(), creation_date) <=  7 THEN '0–7 Tage'
            WHEN DATEDIFF(NOW(), creation_date) <= 30 THEN '8–30 Tage'
            WHEN DATEDIFF(NOW(), creation_date) <= 90 THEN '31–90 Tage'
            WHEN DATEDIFF(NOW(), creation_date) <= 180 THEN '91–180 Tage'
            ELSE '> 180 Tage'
        END                                       AS bucket,
        COUNT(*)                                  AS count,
        MIN(DATEDIFF(NOW(), creation_date))        AS min_days
    FROM tasks
    WHERE task_state != 'completed'
    GROUP BY bucket
    ORDER BY min_days;
    """
    try:
        await db_conn.cursor.execute(query_str)
        rows = await db_conn.cursor.fetchall()
        return [OpenTimeBucket(bucket=row[0], count=row[1]) for row in rows]
    except Exception as e:
        print(e)
        raise


async def query_get_oldest_open_tasks(
        db_conn: db_types.DBConnection,
) -> list[OldestOpenTask]:
    """Top 10 oldest tasks open >100 days, with last comment date from logs."""
    query_str = """
    SELECT
        t.id,
        DATE_FORMAT(t.creation_date, '%d.%m.%Y') AS creation_date,
        t.device_name,
        DATEDIFF(NOW(), t.creation_date) AS days_open,
        DATE_FORMAT(MAX(l.creation_date), '%d.%m.%Y') AS last_comment_date
    FROM tasks t
    LEFT JOIN logs l ON l.task_id = t.id AND l.record_type = 'comment'
    WHERE t.task_state != 'completed'
      AND DATEDIFF(NOW(), t.creation_date) > 100
    GROUP BY t.id
    ORDER BY t.creation_date ASC
    LIMIT 10;
    """
    try:
        await db_conn.cursor.execute(query_str)
        rows = await db_conn.cursor.fetchall()
        return [
            OldestOpenTask(
                id=row[0],
                creation_date=row[1],
                device_name=row[2],
                days_open=row[3],
                last_comment_date=row[4],
            )
            for row in rows
        ]
    except Exception as e:
        print(e)
        raise


async def query_get_manufacturer_stats(
        db_conn: db_types.DBConnection,
) -> list[ManufacturerStat]:
    """All manufacturers by task count as stored in the database."""
    query_str = """
    SELECT
        device_manufacturer AS manufacturer,
        COUNT(*)            AS count
    FROM tasks
    WHERE device_manufacturer IS NOT NULL
      AND device_manufacturer != ''
    GROUP BY BINARY device_manufacturer
    ORDER BY count DESC;
    """
    try:
        await db_conn.cursor.execute(query_str)
        rows = await db_conn.cursor.fetchall()
        return [ManufacturerStat(manufacturer=row[0], count=row[1]) for row in rows]
    except Exception as e:
        print(e)
        raise


async def query_get_tasks_by_manufacturer(
        db_conn: db_types.DBConnection,
        *,
        manufacturer: str,
) -> list[ManufacturerTaskItem]:
    """All tasks for a given manufacturer (exact match as stored in DB)."""
    query_str = """
    SELECT
        id,
        device_name,
        DATE_FORMAT(creation_date, '%d.%m.%Y') AS creation_date
    FROM tasks
    WHERE BINARY device_manufacturer = %s
    ORDER BY creation_date ASC;
    """
    try:
        await db_conn.cursor.execute(query_str, (manufacturer,))
        rows = await db_conn.cursor.fetchall()
        return [
            ManufacturerTaskItem(id=row[0], device_name=row[1], creation_date=row[2])
            for row in rows
        ]
    except Exception as e:
        print(e)
        raise


async def query_update_manufacturer(
        db_conn: db_types.DBConnection,
        *,
        task_id: int,
        manufacturer: str,
) -> None:
    """Update the device_manufacturer for a single task."""
    query_str = "UPDATE tasks SET device_manufacturer = %s WHERE id = %s;"
    try:
        await db_conn.cursor.execute(query_str, (manufacturer, task_id))
    except Exception as e:
        print(e)
        raise


async def query_get_manufacturer_suggestions(
        db_conn: db_types.DBConnection,
        *,
        query: str,
        limit: int = 5,
) -> list[ManufacturerSuggestion]:
    """Return similar manufacturer names using rapidfuzz."""
    from rapidfuzz import process, fuzz

    fetch_str = """
    SELECT DISTINCT device_manufacturer
    FROM tasks
    WHERE device_manufacturer IS NOT NULL
      AND device_manufacturer != '';
    """
    try:
        await db_conn.cursor.execute(fetch_str)
        rows = await db_conn.cursor.fetchall()
    except Exception as e:
        print(e)
        raise

    all_names = [row[0] for row in rows if row[0]]
    if not all_names:
        return []

    matches = process.extract(
        query,
        all_names,
        scorer=fuzz.WRatio,
        limit=limit,
        score_cutoff=40,
    )
    return [
        ManufacturerSuggestion(suggested=match[0], score=int(match[1]))
        for match in matches
        if match[0] != query
    ]


async def query_get_all_statistics(
        db_conn: db_types.DBConnection,
        *,
        from_year: int | None = None,
        from_month: int | None = None,
        to_year: int | None = None,
        to_month: int | None = None,
) -> StatisticsResponse:
    """Fetch all statistics in one call."""
    tasks_per_month = await query_get_tasks_per_month(
        db_conn,
        from_year=from_year,
        from_month=from_month,
        to_year=to_year,
        to_month=to_month,
    )
    oldest_open_tasks = await query_get_oldest_open_tasks(db_conn)
    manufacturers = await query_get_manufacturer_stats(db_conn)
    manufacturer_trends = await query_get_manufacturer_trends(
        db_conn,
        from_year=from_year,
        from_month=from_month,
        to_year=to_year,
        to_month=to_month,
    )
    return StatisticsResponse(
        tasks_per_month=tasks_per_month,
        oldest_open_tasks=oldest_open_tasks,
        manufacturers=manufacturers,
        manufacturer_trends=manufacturer_trends,
    )


async def query_get_manufacturer_trends(
        db_conn: db_types.DBConnection,
        *,
        from_year: int | None = None,
        from_month: int | None = None,
        to_year: int | None = None,
        to_month: int | None = None,
) -> list[ManufacturerTrend]:
    """Monthly task counts for the top 10 manufacturers within the given date range."""
    date_conditions: list[str] = []
    date_params: list[int] = []
    if from_year is not None and from_month is not None:
        date_conditions.append(
            "(YEAR(t.creation_date) > %s OR (YEAR(t.creation_date) = %s AND MONTH(t.creation_date) >= %s))"
        )
        date_params.extend([from_year, from_year, from_month])
    if to_year is not None and to_month is not None:
        date_conditions.append(
            "(YEAR(t.creation_date) < %s OR (YEAR(t.creation_date) = %s AND MONTH(t.creation_date) <= %s))"
        )
        date_params.extend([to_year, to_year, to_month])

    date_where = (" AND " + " AND ".join(date_conditions)) if date_conditions else ""

    query_str = f"""
    SELECT
        t.device_manufacturer,
        YEAR(t.creation_date)  AS year,
        MONTH(t.creation_date) AS month,
        COUNT(*)               AS count
    FROM tasks t
    INNER JOIN (
        SELECT device_manufacturer
        FROM tasks
        WHERE device_manufacturer IS NOT NULL AND device_manufacturer != ''
        GROUP BY BINARY device_manufacturer
        ORDER BY COUNT(*) DESC
        LIMIT 10
    ) top10 ON BINARY t.device_manufacturer = top10.device_manufacturer
    WHERE t.device_manufacturer IS NOT NULL{date_where}
    GROUP BY t.device_manufacturer, YEAR(t.creation_date), MONTH(t.creation_date)
    ORDER BY t.device_manufacturer, year, month;
    """
    try:
        await db_conn.cursor.execute(query_str, date_params if date_params else None)
        rows = await db_conn.cursor.fetchall()
    except Exception as e:
        print(e)
        raise

    # Group rows by manufacturer
    trends: dict[str, list[ManufacturerTrendPoint]] = {}
    for row in rows:
        mfr = row[0]
        if mfr not in trends:
            trends[mfr] = []
        trends[mfr].append(ManufacturerTrendPoint(year=row[1], month=row[2], count=row[3]))

    return [ManufacturerTrend(manufacturer=mfr, data=pts) for mfr, pts in trends.items()]


async def query_get_similar_manufacturer_pairs(
        db_conn: db_types.DBConnection,
        *,
        score_threshold: int = 80,
) -> list:
    """Return pairs of similar manufacturers: (source with fewer tasks) -> (target with more tasks)."""
    from rapidfuzz import fuzz
    from api.models.statistics import ManufacturerSimilarPair

    fetch_str = """
    SELECT device_manufacturer AS manufacturer, COUNT(*) AS count
    FROM tasks
    WHERE device_manufacturer IS NOT NULL AND device_manufacturer != ''
    GROUP BY BINARY device_manufacturer
    ORDER BY count DESC;
    """
    try:
        await db_conn.cursor.execute(fetch_str)
        rows = await db_conn.cursor.fetchall()
    except Exception as e:
        print(e)
        raise

    stats: list[tuple[str, int]] = [(row[0], int(row[1])) for row in rows if row[0]]

    seen_pairs: set[tuple[str, str]] = set()
    result: list[ManufacturerSimilarPair] = []

    for i, (name_a, count_a) in enumerate(stats):
        for j, (name_b, count_b) in enumerate(stats):
            if i >= j:
                continue
            # Case-sensitive comparison: processor=None prevents internal lowercasing.
            # Pure case differences (e.g. "Bosch" vs "bosch") get score 100 explicitly.
            if name_a.lower() == name_b.lower():
                score = 100
            else:
                score = fuzz.WRatio(name_a, name_b, processor=None)
            if score >= score_threshold:
                if count_a <= count_b:
                    source, source_count, target, target_count = name_a, count_a, name_b, count_b
                else:
                    source, source_count, target, target_count = name_b, count_b, name_a, count_a
                pair_key = (source, target)
                if pair_key not in seen_pairs:
                    seen_pairs.add(pair_key)
                    result.append(ManufacturerSimilarPair(
                        source=source,
                        source_count=source_count,
                        target=target,
                        target_count=target_count,
                        score=int(score),
                    ))

    result.sort(key=lambda x: x.source_count)
    return result


async def query_bulk_rename_manufacturer(
        db_conn: db_types.DBConnection,
        *,
        source: str,
        target: str,
) -> int:
    """Rename all tasks where manufacturer matches source to target. Returns affected row count."""
    query_str = """
    UPDATE tasks SET device_manufacturer = %s
    WHERE BINARY device_manufacturer = %s;
    """
    try:
        await db_conn.cursor.execute(query_str, (target, source))
        return db_conn.cursor.rowcount
    except Exception as e:
        print(e)
        raise
