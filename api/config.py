import re
import os
import dotenv

dotenv.load_dotenv()

EMAIL_REGEX = re.compile(r"^[\w\-\_\+\.]+@([\w-]+\.)+[\w-]{2,}$")
"""Compiled RegEx for email adresses."""

SECRET_KEY=os.getenv("SECRET_KEY", "1234567890")
ALGORITHM=os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 1440))
NEXT_PUBLIC_API_URL=os.getenv("NEXT_PUBLIC_API_URL", "https://reparaturcafe-3.it-awo.de")
