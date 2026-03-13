import datetime
import pydantic
    

class LogBase(pydantic.BaseModel):
    """Log base data model."""

    id: int
    creation_date: datetime.datetime


class LogDataAssignments(pydantic.BaseModel):
    """Log data assignments model."""

    supervisor_id: int
    task_id: int


class LogData(pydantic.BaseModel):
    """Log data model."""

    comment: str = pydantic.Field(max_length=1000)
    record_type: str


class PayloadLog(LogBase, LogData):
    """Payload Log data model."""

    supervisor_name: str | None
    image_url: str | None = None


class PayloadLogRecordCreate(LogData, LogDataAssignments):
    """Payload Log record create data model."""
    image_url: str | None = None

