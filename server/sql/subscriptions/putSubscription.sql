INSERT INTO subscriptions(name, nickname, due_date, reminder_days, amount, user_id)
VALUES (NULLIF(${name}, ''), NULLIF(${nickname}, ''), ${dueDate}::TIMESTAMPTZ, ${reminderDays}, ${amount}, ${userId})
RETURNING name, nickname, to_char(due_date, 'YYYY-MM-DD') AS "dueDate", reminder_days AS "reminderDays", amount, subscription_uuid AS "subscriptionUuid";