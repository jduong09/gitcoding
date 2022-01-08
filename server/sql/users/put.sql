INSERT INTO users(name, identifier)
VALUES(${name}, ${identifier})
RETURNING *;