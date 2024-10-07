-- Deploy reparaturcafe:users to mysql
-- requires: oskar

BEGIN;

create table users (
    id smallint unsigned primary key auto_increment,
    email varchar(255) not null unique,
    username varchar(255) not null unique,
    first_name varchar(255),
    last_name varchar(255),
    active boolean not null,
    hashed_password varchar(255) not null
);

COMMIT;
