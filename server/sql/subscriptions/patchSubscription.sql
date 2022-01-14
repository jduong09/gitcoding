UPDATE subscriptions 
SET name = ${name}, 
    nickname = ${nickname}, 
    removed_at = ${removed_at}, 
    due_date = ${due_date}, 
    reminder_days = ${reminder_days}, 
    amount = ${amount}
WHERE subscription_uuid = ${uuid}
RETURNING name, nickname, to_char(due_date, 'YYYY-MM-DD') as due_date, reminder_days, amount::numeric, subscription_uuid;
