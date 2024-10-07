-- Verify reparaturcafe:users on mysql

BEGIN;

select
    id,
    email,
    username,
    first_name,
    last_name,
    active,
    hashed_password
from users where 0;

ROLLBACK;
