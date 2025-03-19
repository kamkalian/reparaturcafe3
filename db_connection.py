from __future__ import annotations

import os
import asyncmy


def create_mysql_connection():
    """Create async MySQL connection."""

    return asyncmy.connect(
        user= "root",
        password= "rootpassword",
        database= "reparaturcafe",
        )
