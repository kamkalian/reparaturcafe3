from __future__ import annotations

import typing as t

from api.models.owner import PayloadOwnerCreate, OwnerFull, PayloadOwnerUpdate, PayloadOwnerSearch

if t.TYPE_CHECKING:
    import api.typing.db as db_types


async def query_insert_owner(
        db_conn: db_types.DBConnection,
        *,
        owner_payload: PayloadOwnerCreate
) -> int:
    """Insert new owner."""
    query_str = """
    insert into owners (email, phone, first_name, last_name, street, street_no, zip)
    values (%s, %s, %s, %s, %s, %s, %s);
    """
    _query_params = (
        owner_payload.email,
        owner_payload.phone,
        owner_payload.first_name,
        owner_payload.last_name,
        owner_payload.street,
        owner_payload.street_no,
        owner_payload.zip
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


async def query_get_owner_by_id(
        db_conn: db_types.DBConnection,
        *,
        owner_id: int,
) -> OwnerFull:
    query_str = """
    select id, email, phone, first_name, last_name, street, street_no, zip from owners where id = %s;
    """
    _query_params = (
        owner_id
    )
    try:
        await db_conn.cursor.execute(query_str, _query_params)
        row = await db_conn.cursor.fetchone()
        return OwnerFull(
            id=row[0], 
            email=row[1],
            phone=row[2],
            first_name=row[3],
            last_name=row[4],
            street=row[5],
            street_no=row[6],
            zip=row[7]
        )
    except Exception as e:
        print(e)
        raise


async def query_get_owners(
        db_conn: db_types.DBConnection,
) -> t.Generator[OwnerFull]:
    query_str = """
    select id, email, phone, first_name, last_name, street, street_no, zip from owners;
    """
    try:
        await db_conn.cursor.execute(query_str)
        rows = await db_conn.cursor.fetchall()
        return (
            OwnerFull(
                id=row[0], 
                email=row[1],
                phone=row[2],
                first_name=row[3],
                last_name=row[4],
                street=row[5],
                street_no=row[6],
                zip=row[7]
            ) for row in rows
            )
    except Exception as e:
        print(e)
        raise


async def query_get_owners_by_search(
        db_conn: db_types.DBConnection,
        *,
        search_payload: PayloadOwnerSearch
) -> t.Generator[OwnerFull]:
    query_str = """
    select id, email, phone, first_name, last_name, street, street_no, zip
    from owners
    where email like %s 
    or phone like %s
    or first_name like %s
    or last_name like %s
    or street like %s
    order by first_name limit 5;
    """
    search_str = "%" + search_payload.search + "%"
    _query_params = (
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
            OwnerFull(
                id=row[0], 
                email=row[1],
                phone=row[2],
                first_name=row[3],
                last_name=row[4],
                street=row[5],
                street_no=row[6],
                zip=row[7]
            ) for row in rows
            )
    except Exception as e:
        print(e)
        raise


async def query_update_owner(
        db_conn: db_types.DBConnection,
        *,
        owner_id: int,
        owner_payload: PayloadOwnerUpdate
) -> None:
    """Update user."""
    query_str = """
    update owners set email = %s, phone = %s, first_name = %s, last_name = %s, street = %s, street_no = %s, zip = %s
    where id = %s;
    """
    _query_params = (
        owner_payload.email,
        owner_payload.phone,
        owner_payload.first_name,
        owner_payload.last_name,
        owner_payload.street,
        owner_payload.street_no,
        owner_payload.zip,
        owner_id
    )
    try:
        await db_conn.cursor.execute(query_str, _query_params)
    except Exception as e:
        print(e)
        raise