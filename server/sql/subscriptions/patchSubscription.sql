UPDATE subscriptions 
SET name = NULLIF(${name}, ''), 
    nickname = NULLIF(${nickname}, ''), 
    removed_at = ${removedAt}, 
    due_date = ${dueDate}, 
    reminder_days = NULLIF(${reminderDays}, 0),
    amount = ${amount}
WHERE subscription_uuid = ${subscriptionUuid}
RETURNING name, nickname, to_char(due_date, 'YYYY-MM-DD') AS 'dueDate', reminder_days AS 'reminderDays', amount::numeric, subscription_uuid AS 'subscriptionUuid';
