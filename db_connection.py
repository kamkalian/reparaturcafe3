from __future__ import annotations

import os
import asyncmy


def create_mysql_connection():
    """Create async MySQL connection."""

    return asyncmy.connect(
        user=os.getenv("DB_MYSQL_USER"),
        password=os.getenv("DB_MYSQL_PASSWORD"),
        database=os.getenv("DB_MYSQL_DATABASE")
        )
