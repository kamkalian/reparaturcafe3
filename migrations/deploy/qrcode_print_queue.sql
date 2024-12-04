-- Deploy reparaturcafe:qrcode_print_queue to mysql

BEGIN;

create table qrcode_print_queue (
    id smallint unsigned primary key auto_increment,
    task_id int not null,
    print_done boolean not null default false,
    creation_date timestamp not null default CURRENT_TIMESTAMP
);

COMMIT;
