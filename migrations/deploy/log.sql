-- Deploy reparaturcafe:log to mysql

BEGIN;

create table logs (
    id smallint unsigned primary key auto_increment,
    creation_date timestamp not null default CURRENT_TIMESTAMP,
    comment varchar(255),
    record_type varchar(255),
    task_id int,
    supervisor_id int
);

COMMIT;
