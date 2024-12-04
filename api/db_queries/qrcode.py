from __future__ import annotations

import typing as t

from api.models.qrcode import PayloadPrintJob

if t.TYPE_CHECKING:
    import api.typing.db as db_types


async def query_insert_print_job(
        db_conn: db_types.DBConnection,
        *,
        task_id: int
) -> int:
    """Insert new qrcode print job."""
    query_str = """
    insert into qrcode_print_queue (task_id)
    values (%s);
    """
    _query_params = (
        str(task_id)
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


async def query_complete_print_job(
        db_conn: db_types.DBConnection,
        *,
        qrcode_id: int
) -> None:
    """Update qrcode print job."""
    query_str = """
    update qrcode_print_queue set print_done = true where id = %s;
    """
    _query_params = (
        str(qrcode_id)
    )
    try:
        await db_conn.cursor.execute(query_str, _query_params)
    except Exception as e:
        print(e)
        raise


async def query_get_print_jobs(
        db_conn: db_types.DBConnection
) -> list[PayloadPrintJob]:
    """Get all print jobs from task."""
    query_str = """
    select 
    id,
    task_id,
    creation_date
    from qrcode_print_queue
    where print_done = false;
    """
    try:
        await db_conn.cursor.execute(query_str)
        rows = await db_conn.cursor.fetchall()
        return [
            PayloadPrintJob(
            id=row[0],
            task_id=row[1],
            creation_date=row[2]
             ) for row in rows]
    except Exception as e:
        print(e)
        raise

