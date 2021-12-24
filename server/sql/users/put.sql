INSERT INTO users(name)
VALUES(${name})
RETURNING *;