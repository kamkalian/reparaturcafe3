"""Types for DB stuff."""

from __future__ import annotations

import typing as t

import asyncmy
import asyncmy.cursors

ConnectionT: t.TypeAlias = asyncmy.Connection
CursorT: t.TypeAlias = asyncmy.cursors.Cursor

class DBConnection(t.NamedTuple):
    """Named tuple containing DB connection items."""

    connection: ConnectionT
    cursor: CursorT
    
