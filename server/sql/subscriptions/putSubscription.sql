INSERT INTO subscriptions(name, nickname, due_date, reminder_days, amount, user_id)
VALUES (${name}, NULLIF(${nickname}, ''), ${due_date}::TIMESTAMPTZ, ${reminder_days}, ${amount}, ${user_id})
RETURNING name, nickname, to_char(due_date, 'YYYY-MM-DD') AS 'dueDate', reminder_days AS 'reminderDays', amount::numeric, subscription_uuid AS 'subscriptionUuid';