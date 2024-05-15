create table auth.account
(
    id            bigserial    not null primary key,
    public_id     varchar(12)  not null unique,
    email         varchar(255) not null unique,
    password_hash char(60)     not null,
    create_time   timestamp    not null default current_timestamp,
    update_time   timestamp    not null default current_timestamp
);

create trigger update_update_time
    before update
    on auth.account
    for each row
execute function update_update_time();
