create function update_update_time() returns trigger as
$$
begin
    new.update_time = current_timestamp;

    return new;
end;
$$ language plpgsql;
