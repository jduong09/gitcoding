UPDATE subscriptions
SET due_date = ${dueDate}
WHERE subscription_uuid = ${subscriptionUuid}
RETURNING name, nickname, due_date AS "dueDate", reminder_days AS "reminderDays", amount, subscription_uuid AS "subscriptionUuid";