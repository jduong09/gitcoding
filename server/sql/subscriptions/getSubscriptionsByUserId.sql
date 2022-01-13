SELECT 
  name, 
  nickname, 
  to_char(due_date, 'YYYY-MM-DD') AS due_date, 
  reminder_days, 
  amount, 
  subscription_uuid 
FROM subscriptions 
WHERE(user_id = ${userId});