INSERT INTO subscriptions(name, nickname, due_date, reminder_days, amount, user_id)
VALUES (NULLIF(${name}, ''), NULLIF(${nickname}, ''), ${dueDate}, ${reminderDays}, ${amount}, ${userId})
RETURNING name, nickname, reminder_days AS "reminderDays", amount, subscription_uuid AS "subscriptionUuid";