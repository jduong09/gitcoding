INSERT INTO subscriptions(name, nickname, due_date, reminder_days, amount, user_id)
VALUES (${name}, ${nickname}, make_timestamptz(${due_date_year}, ${due_date_month}, ${due_date_day}, 0, 0, 0), ${reminder_days}, ${amount}, ${user_id})
RETURNING *;