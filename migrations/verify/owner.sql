-- Verify reparaturcafe:owner on mysql

BEGIN;

select
    id,
    creation_date,
    first_name,
    last_name,
    phone,
    street,
    street_no,
    zip,
    email
from owners where 0;

ROLLBACK;
