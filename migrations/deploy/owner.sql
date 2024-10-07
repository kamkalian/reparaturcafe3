-- Deploy reparaturcafe:owner to mysql

BEGIN;

create table owners (
    id smallint unsigned primary key auto_increment,
    creation_date timestamp not null default CURRENT_TIMESTAMP,
    first_name varchar(255),
    last_name varchar(255),
    phone varchar(255),
    street varchar(255),
    street_no varchar(10),
    zip varchar(20),
    email varchar(255)
);

alter table tasks
add owner_id int;

COMMIT;
