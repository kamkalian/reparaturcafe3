import pydantic

import api.validators
from typing import Annotated

    

class OwnerBase(pydantic.BaseModel):
    """Owner base data model."""

    id: int


class OwnerData(pydantic.BaseModel):
    """Owner data model."""

    email: str | None = None
    phone: str | None = None

    last_name: str
    first_name: str | None = None

    street: str
    street_no: str
    zip: str

    @pydantic.field_validator("email", mode="before")
    @classmethod
    def validate_email(cls, value: object) -> str | None:
        """Validate email."""
        return api.validators.parse_and_validate_email(value)
    

class OwnerFull(OwnerBase, OwnerData):
    """Owner full data modell."""


class PayloadOwnerCreate(OwnerData):
    """Payload owner create data model."""


class PayloadOwnerUpdate(OwnerData):
    """Payload owner update data model."""


class PayloadOwnerSearch(pydantic.BaseModel):
    """Payload owner search data model."""

    search: Annotated[str, pydantic.StringConstraints(min_length=3)]



    
