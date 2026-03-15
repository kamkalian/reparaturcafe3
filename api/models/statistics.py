"""Statistics data models."""
from __future__ import annotations

import pydantic


class TasksPerMonth(pydantic.BaseModel):
    """Tasks per month stat."""

    year: int
    month: int
    count: int


class OpenTimeStat(pydantic.BaseModel):
    """Open-time statistics aggregate for currently open (non-completed) tasks."""

    avg_days: float | None
    min_days: int | None
    max_days: int | None
    total_open: int


class OpenTimeBucket(pydantic.BaseModel):
    """Open-time distribution bucket."""

    bucket: str
    count: int


class ManufacturerStat(pydantic.BaseModel):
    """Manufacturer usage stat."""

    manufacturer: str
    count: int


class ManufacturerTaskItem(pydantic.BaseModel):
    """A task belonging to a specific manufacturer."""

    id: int
    device_name: str
    creation_date: str


class ManufacturerSuggestion(pydantic.BaseModel):
    """A suggested normalized manufacturer name."""

    suggested: str
    score: int


class PayloadUpdateManufacturer(pydantic.BaseModel):
    """Payload for updating the manufacturer of a task."""

    manufacturer: str


class ManufacturerSimilarPair(pydantic.BaseModel):
    """A pair of similar manufacturer names where source should be renamed to target."""

    source: str
    source_count: int
    target: str
    target_count: int
    score: int


class PayloadBulkRenameManufacturer(pydantic.BaseModel):
    """Payload for bulk-renaming all tasks of one manufacturer to another."""

    source: str
    target: str


class OldestOpenTask(pydantic.BaseModel):
    """One of the oldest still-open tasks."""

    id: int
    creation_date: str
    device_name: str
    days_open: int
    last_comment_date: str | None = None


class ManufacturerTrendPoint(pydantic.BaseModel):
    """A single month data point for a manufacturer trend."""

    year: int
    month: int
    count: int


class ManufacturerTrend(pydantic.BaseModel):
    """Monthly task counts for one manufacturer."""

    manufacturer: str
    data: list[ManufacturerTrendPoint]


class StatisticsResponse(pydantic.BaseModel):
    """Combined statistics response."""

    tasks_per_month: list[TasksPerMonth]
    oldest_open_tasks: list[OldestOpenTask]
    manufacturers: list[ManufacturerStat]
    manufacturer_trends: list[ManufacturerTrend]
