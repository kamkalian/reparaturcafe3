
from __future__ import annotations

from api.models.user import PayloadUserCreate
import asyncio
from api.auth import get_password_hash
from db_connection import create_mysql_connection


async def create_user():
    
    db_conn = await create_mysql_connection()
    

    username = input("Username:")
    email = input("Email:")
    password = input("Password:")

    user_payload = PayloadUserCreate(
        email=email,
        username=username,
        password=password
    )

    async with db_conn.cursor() as cursor:
        query_str = """
        insert into users (email, username, active, hashed_password)
        values (%s, %s, %s, %s);
        """
        _query_params = (
            user_payload.email,
            user_payload.username,
            1,
            get_password_hash(user_payload.password)
        )
        try:
            await cursor.execute(query_str, _query_params)
            await cursor.execute("select last_insert_id();")
            row = await cursor.fetchone()
            if row is None or row[0] is None:
                err_msg = "Query returned None, but should always return anything."
                raise AssertionError(err_msg)
            await cursor.connection.commit()
            print(int(row[0]))
            return int(row[0])
        except Exception as e:
            print(e)
            raise


if __name__ == '__main__':
    asyncio.run(create_user())