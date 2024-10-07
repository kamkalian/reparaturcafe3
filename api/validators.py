import re

import api.config


def parse_and_validate_email(
    value: object, *, email_regex: re.Pattern[str] = api.config.EMAIL_REGEX
) -> str | None:
    """Parse and validate email adresses.

    - If value is ``None`` return ``None``.
    - If value is a sting, validate it and if ok return casefolded version.

    Raises ValueError if value is not None or a valid email
    """
    if value is None:
        return None

    if isinstance(value, str):
        lower_value = value.casefold()
        if email_regex.fullmatch(lower_value) is not None:
            return lower_value
        err_msg = f"Value is not a valid email address: {value!r}"
        raise ValueError(err_msg)

    err_msg = f"Value is not None or str: '{type(value)!r}'"
    raise TypeError(err_msg)
