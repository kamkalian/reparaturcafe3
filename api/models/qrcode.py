import pydantic
import datetime

    

class PayloadPrintJob(pydantic.BaseModel):
    """PrintJob base data model."""

    id: int
    task_id: int
    creation_date: datetime.datetime
