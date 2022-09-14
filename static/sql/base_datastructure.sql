CREATE TABLE user_data (
    id SERIAL primary key,
    name TEXT UNIQUE,
    password TEXT
)