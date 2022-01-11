INSERT INTO subscriptions(name, nickname, due_date, reminder_days, amount, user_id)
VALUES (${name}, ${nickname}, ${due_date}::TIMESTAMPTZ, ${reminder_days}, ${amount}, ${user_id})
RETURNING *;