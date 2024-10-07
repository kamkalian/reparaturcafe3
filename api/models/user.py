import pydantic

import api.validators

    

class UserBase(pydantic.BaseModel):
    """User base data model."""

    id: int
    active: bool


class UserData(pydantic.BaseModel):
    """User data model."""

    email: str

    username: str
    lastname: str | None = None
    firstname: str | None = None

    @pydantic.field_validator("email", mode="before")
    @classmethod
    def validate_email(cls, value: object) -> str | None:
        """Validate email."""
        return api.validators.parse_and_validate_email(value)


class UserFull(UserBase, UserData):
    """User full data model."""


class PayloadUserCreate(UserData):
    """Payload user create data model."""
    
    password: str


class PayloadUserUpdate(UserData):
    """Payload user update data model."""

    active: bool


class UserInDB(UserBase):
    hashed_password: str


class Token(pydantic.BaseModel):
    access_token: str
    token_type: str


class TokenData(pydantic.BaseModel):
    username: str
