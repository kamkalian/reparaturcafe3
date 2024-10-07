import datetime
from enum import Enum

import pydantic
from typing import Annotated


class State(Enum):
    NEW = "new"
    IN_PROCESS = "in_process"
    DONE = "done"
    COMPLETED = "completed"


class NextStep(Enum):
    NONE = "none"
    CALL_OWNER = "call_owner"


class TaskState(pydantic.BaseModel):
    """Task state data model."""

    task_state: State
    task_next_step: NextStep | None


class TaskBase(pydantic.BaseModel):
    """Task base model."""

    id: int
    creation_date: datetime.datetime
    supervisor_id: int | None
    owner_id: int | None


class TaskDeviceInfo(pydantic.BaseModel):
    """Task data device info model."""

    device_name: str
    device_error_description: str
    device_manufacturer: str | None
    device_model: str | None


class TaskDeviceLocation(pydantic.BaseModel):
    """Task data device location model."""

    shelf_no: str | None
    shelf_floor_no: str | None
    other_location: str | None


class TaskFull(TaskBase, TaskState, TaskDeviceInfo, TaskDeviceLocation):
    """Task data model."""


class TaskFullWithSupervisorName(TaskFull):
    """Task data model with supervisor_name."""

    supervisor_name: str | None


class TaskSimple(TaskDeviceLocation):
    """Task simple data model."""

    id: int
    device_name: str
    supervisor_name: str | None
    creation_date: datetime.datetime


class PayloadTaskCreate(TaskDeviceInfo):
    """Task payload data model."""


class PayloadTaskSupervisorUpdate(pydantic.BaseModel):
    """Task supervisor update data model"""

    supervisor_id: int | None


class PayloadTaskOwnerUpdate(pydantic.BaseModel):
    """Task owner update data model"""

    owner_id: int | None


class PayloadTaskDeviceUpdate(TaskDeviceInfo):
    """Task device update data model."""


class PayloadTaskDeviceLocationUpdate(TaskDeviceLocation):
    """Task device location update data model."""


class PayloadTaskSearch(pydantic.BaseModel):
    """Payload task search data model."""

    search: Annotated[str, pydantic.StringConstraints(min_length=3)]