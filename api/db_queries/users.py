from __future__ import annotations

import typing as t

from api.models.user import UserFull, UserInDB, PayloadUserCreate, PayloadUserUpdate
import api.auth

if t.TYPE_CHECKING:
    import api.typing.db as db_types


async def query_get_user_by_id(
        db_conn: db_types.DBConnection,
        *,
        user_id: int,
) -> UserFull | None:
    query_str = """
    select * from users where id = %s;
    """
    _query_params = (
        user_id
    )
    try:
        await db_conn.cursor.execute(query_str, _query_params)
        row = await db_conn.cursor.fetchone()
        return UserFull(
                id=row[0], 
                email=row[1],
                username=row[2],
                firstname=row[3],
                lastname=row[4],
                active=row[5]
        )
    except Exception as e:
        print(e)
        raise


async def query_get_user_by_username(
        db_conn: db_types.DBConnection,
        *,
        username: str,
) -> UserInDB | None:
    query_str = """
    select id, active, hashed_password from users where username = %s;
    """
    _query_params = (
        username
    )
    try:
        await db_conn.cursor.execute(query_str, _query_params)
        row = await db_conn.cursor.fetchone()
        if row is None:
            return None
        return UserInDB(
                id=row[0], 
                active=row[1],
                hashed_password=row[2]
        )
    except Exception as e:
        print(e)
        raise


async def query_get_users(
        db_conn: db_types.DBConnection,
) -> t.Generator[UserFull]:
    query_str = """
    select id, email, username, first_name, last_name, active from users;
    """
    try:
        await db_conn.cursor.execute(query_str)
        rows = await db_conn.cursor.fetchall()
        return (
            UserFull(
                id=row[0], 
                email=row[1],
                username=row[2],
                firstname=row[3],
                lastname=row[4],
                active=row[5]
            ) for row in rows
            )
    except Exception as e:
        print(e)
        raise


async def query_insert_user(
        db_conn: db_types.DBConnection,
        *,
        user_payload: PayloadUserCreate
) -> int:
    """Insert new user."""
    query_str = """
    insert into users (email, username, first_name, last_name, active, hashed_password)
    values (%s, %s, %s, %s, %s, %s);
    """
    _query_params = (
        user_payload.email,
        user_payload.username,
        user_payload.firstname,
        user_payload.lastname,
        0,
        api.auth.get_password_hash(user_payload.password)
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


async def query_update_user(
        db_conn: db_types.DBConnection,
        *,
        user_id: int,
        user_payload: PayloadUserUpdate
) -> None:
    """Update user."""
    query_str = """
    update users set email = %s, username = %s, first_name = %s, last_name = %s, active = %s
    where id = %s;
    """
    _query_params = (
        user_payload.email,
        user_payload.username,
        user_payload.firstname,
        user_payload.lastname,
        user_payload.active,
        user_id
    )
    try:
        await db_conn.cursor.execute(query_str, _query_params)
    except Exception as e:
        print(e)
        raise