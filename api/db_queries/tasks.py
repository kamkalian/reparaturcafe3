from __future__ import annotations

import typing as t

from api.models.task import (
    TaskFull,
    PayloadTaskCreate,
    TaskFullWithSupervisorName,
    TaskSimple,
    State,
    NextStep,
    PayloadTaskSupervisorUpdate,
    PayloadTaskOwnerUpdate,
    PayloadTaskDeviceUpdate,
    PayloadTaskDeviceLocationUpdate,
    PayloadTaskSearch
)
if t.TYPE_CHECKING:
    import api.typing.db as db_types


async def query_get_task_by_id(
        db_conn: db_types.DBConnection,
        *,
        task_id: int,
) -> TaskFullWithSupervisorName | None:
    query_str = """
    select 
        t.id, 
        creation_date, 
        supervisor_id, 
        device_name,
        device_error_description,
        device_manufacturer,
        device_model,
        shelf_no,
        shelf_floor_no,
        task_state,
        task_next_step,
        owner_id,
        other_location,
        username
    from tasks as t
    left join users as u on u.id = t.supervisor_id
    where t.id = %s;
    """
    _query_params = (
        task_id
    )
    try:
        await db_conn.cursor.execute(query_str, _query_params)
        row = await db_conn.cursor.fetchone()
        if row is None:
            return None
        return TaskFullWithSupervisorName(
                id=row[0], 
                creation_date=row[1],
                supervisor_id=row[2],
                device_name=row[3],
                device_error_description=row[4],
                device_manufacturer=row[5],
                device_model=row[6],
                shelf_no=row[7],
                shelf_floor_no=row[8],
                task_state=row[9],
                task_next_step=row[10],
                owner_id=row[11],
                other_location=row[12],
                supervisor_name=row[13]
            )
    except Exception as e:
        print(e)
        raise


async def query_get_tasks(
        db_conn: db_types.DBConnection,
        search_term: str | None,
        state_filters: list[str] | None,
) -> t.Generator[TaskFull]:
    query_str = """
        select 
        t.id, 
        t.creation_date, 
        supervisor_id,
        device_name,
        device_error_description,
        device_manufacturer,
        device_model,
        shelf_no,
        shelf_floor_no,
        task_state,
        task_next_step,
        owner_id,
        other_location 
        from tasks as t
    """

    where_clauses: list[str] = []
    joins: list[str] = []
    query_params: list[int | str | None] = []
    if search_term is not None:
        joins.append(" left join owners as o on owner_id = o.id ")
        where_clauses.append(
            """
            (t.id = %s or
            device_name like %s or
            device_error_description like %s or
            device_manufacturer like %s or
            device_model like %s or
            first_name like %s or
            last_name like %s) 
            """
        )
        query_params.append(search_term)
        for i in range(1,7):
            query_params.append(t.cast(int | str | None, "%" + search_term + "%"))   
    
    if state_filters is not None:
        if len(state_filters) > 0:
            state_filters_str = " task_state in ('" + "', '".join(state_filters) + "')"
            where_clauses.append(state_filters_str)

    query_str += "".join(joins)

    if len(where_clauses) > 0:
        query_str += "where"
        query_str += " and ".join(where_clauses)


    query_str += ";"
    try:
        await db_conn.cursor.execute(query_str, query_params)
        rows = await db_conn.cursor.fetchall()
        return (
            TaskFull(
                id=row[0], 
                creation_date=row[1],
                supervisor_id=row[2],
                device_name=row[3],
                device_error_description=row[4],
                device_manufacturer=row[5],
                device_model=row[6],
                shelf_no=row[7],
                shelf_floor_no=row[8],
                task_state=row[9],
                task_next_step=row[10],
                owner_id=row[11],
                other_location=row[12]
            ) for row in rows
            )
    except Exception as e:
        print(e)
        raise


async def query_get_simple_tasks(
        db_conn: db_types.DBConnection,
) -> t.Generator[TaskSimple]:
    query_str = """
        select 
            tasks.id, 
            creation_date, 
            username, 
            device_name,
            shelf_no,
            shelf_floor_no,
            other_location
        from tasks
        left join users on supervisor_id = users.id
        where task_state != 'completed';
    """
    try:
        await db_conn.cursor.execute(query_str)
        rows = await db_conn.cursor.fetchall()
        return (
            TaskSimple(
                id=row[0], 
                creation_date=row[1],
                supervisor_name=row[2],
                device_name=row[3],
                shelf_no=row[4],
                shelf_floor_no=row[5],
                other_location=row[6]
            ) for row in rows
            )
    except Exception as e:
        print(e)
        raise


async def query_insert_task(
        db_conn: db_types.DBConnection,
        *,
        task_payload: PayloadTaskCreate
) -> int:
    """Insert new task."""
    query_str = """
    insert into tasks (device_name, device_manufacturer, device_error_description, device_model, task_state)
    values (%s, %s, %s, %s, %s);
    """
    _query_params = (
        task_payload.device_name,
        task_payload.device_manufacturer,
        task_payload.device_error_description,
        task_payload.device_model,
        "new",
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


async def query_update_device(
        db_conn: db_types.DBConnection,
        *,
        task_id: int,
        task_device_payload: PayloadTaskDeviceUpdate
) -> None:
    """Update device."""
    query_str = """
    update tasks set device_name = %s, device_error_description = %s, device_manufacturer = %s, device_model = %s
    where id = %s;
    """
    _query_params = (
        task_device_payload.device_name,
        task_device_payload.device_error_description,
        task_device_payload.device_manufacturer,
        task_device_payload.device_model,
        task_id
    )
    try:
        await db_conn.cursor.execute(query_str, _query_params)
    except Exception as e:
        print(e)
        raise


async def query_update_supervisor(
        db_conn: db_types.DBConnection,
        *,
        task_id: int,
        task_supervisor_payload: PayloadTaskSupervisorUpdate
) -> None:
    """Update supervisor."""
    query_str = """
    update tasks set supervisor_id = %s
    where id = %s;
    """
    _query_params = (
        task_supervisor_payload.supervisor_id,
        task_id
    )
    try:
        await db_conn.cursor.execute(query_str, _query_params)
    except Exception as e:
        print(e)
        raise


async def query_update_owner(
        db_conn: db_types.DBConnection,
        *,
        task_id: int,
        task_owner_payload: PayloadTaskOwnerUpdate
) -> None:
    """Update owner."""
    query_str = """
    update tasks set owner_id = %s
    where id = %s;
    """
    _query_params = (
        task_owner_payload.owner_id,
        task_id
    )
    try:
        await db_conn.cursor.execute(query_str, _query_params)
    except Exception as e:
        print(e)
        raise


async def query_update_state(
        db_conn: db_types.DBConnection,
        *,
        task_id: int,
        task_state: State
) -> None:
    """Update supervisor."""
    query_str = """
    update tasks set task_state = %s
    where id = %s;
    """
    _query_params = (
        task_state.value,
        task_id
    )
    try:
        await db_conn.cursor.execute(query_str, _query_params)
    except Exception as e:
        print(e)
        raise


async def query_update_next_step(
        db_conn: db_types.DBConnection,
        *,
        task_id: int,
        task_next_step: NextStep
) -> None:
    """Update supervisor."""
    query_str = """
    update tasks set task_next_step = %s
    where id = %s;
    """
    _query_params = (
        task_next_step.value,
        task_id
    )
    try:
        await db_conn.cursor.execute(query_str, _query_params)
    except Exception as e:
        print(e)
        raise


async def query_update_device_location(
        db_conn: db_types.DBConnection,
        *,
        task_id: int,
        task_device_location_payload: PayloadTaskDeviceLocationUpdate
) -> None:
    """Update device location."""
    query_str = """
    update tasks set shelf_no = %s, shelf_floor_no = %s, other_location = %s
    where id = %s;
    """
    _query_params = (
        task_device_location_payload.shelf_no,
        task_device_location_payload.shelf_floor_no,
        task_device_location_payload.other_location,
        task_id
    )
    try:
        await db_conn.cursor.execute(query_str, _query_params)
    except Exception as e:
        print(e)
        raise


async def query_get_task_by_search(
        db_conn: db_types.DBConnection,
        *,
        search_payload: PayloadTaskSearch
) -> t.Generator[TaskFull]:
    query_str = """
    select 
        t.id, 
        t.creation_date, 
        supervisor_id, 
        device_name,
        device_error_description,
        device_manufacturer,
        device_model,
        shelf_no,
        shelf_floor_no,
        task_state,
        task_next_step,
        owner_id,
        other_location
    from tasks as t
    left join users as u on u.id = supervisor_id
    left join owners as o on o.id = owner_id
    where o.email like %s 
    or o.phone like %s
    or o.first_name like %s
    or o.last_name like %s
    or o.street like %s
    or u.username like %s
    or u.email like %s
    or u.first_name like %s
    or u.last_name like %s
    or t.device_name like %s
    or t.device_error_description like %s
    or t.device_manufacturer like %s
    or t.device_model like %s;
    """
    search_str = "%" + search_payload.search + "%"
    _query_params = (
        search_str,
        search_str,
        search_str,
        search_str,
        search_str,
        search_str,
        search_str,
        search_str,
        search_str,
        search_str,
        search_str,
        search_str,
        search_str
    )
    try:
        await db_conn.cursor.execute(query_str, _query_params)
        rows = await db_conn.cursor.fetchall()
        return (
            TaskFull(
                id=row[0], 
                creation_date=row[1],
                supervisor_id=row[2],
                device_name=row[3],
                device_error_description=row[4],
                device_manufacturer=row[5],
                device_model=row[6],
                shelf_no=row[7],
                shelf_floor_no=row[8],
                task_state=row[9],
                task_next_step=row[10],
                owner_id=row[11],
                other_location=row[12]
            ) for row in rows
            )
    except Exception as e:
        print(e)
        raise