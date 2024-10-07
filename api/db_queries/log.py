from __future__ import annotations

import typing as t

from api.models.log import PayloadLogRecordCreate, PayloadLog

if t.TYPE_CHECKING:
    import api.typing.db as db_types


async def query_insert_log_record(
        db_conn: db_types.DBConnection,
        *,
        log_payload: PayloadLogRecordCreate
) -> int:
    """Insert new log record."""
    query_str = """
    insert into logs (comment, supervisor_id, task_id, record_type)
    values (%s, %s, %s, %s);
    """
    _query_params = (
        log_payload.comment,
        log_payload.supervisor_id,
        log_payload.task_id,
        log_payload.record_type
    )
    try:
        await db_conn.cursor.execute(query_str, _query_params)
        await db_conn.cursor.execute("select last_insert_id();")
        row = await db_conn.cursor.fetchone()
        if row is None or row[0] is None:
            err_msg = "Query returned None, but should always return anything."
            raise AssertionError(err_msg)
        return int(row[0])
    except Exception as e:
        print(e)
        raise


async def query_get_logs_from_task(
        db_conn: db_types.DBConnection,
        *,
        task_id: int
) -> t.Generator[PayloadLog]:
    """Get all logs from task."""
    query_str = """
    select 
    l.id,
    creation_date,
    comment,
    record_type,
    username
    from logs as l
    left join users as u on supervisor_id = u.id
    where task_id = %s;
    """
    _query_params = (
        str(task_id)
    )
    try:
        await db_conn.cursor.execute(query_str, _query_params)
        rows = await db_conn.cursor.fetchall()
        return (
            PayloadLog(
            id=row[0],
            creation_date=row[1],
            comment=row[2],
            record_type=row[3],
            supervisor_name=row[4]
        ) for row in rows)
    except Exception as e:
        print(e)
        raise

