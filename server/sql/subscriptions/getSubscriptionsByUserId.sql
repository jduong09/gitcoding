SELECT 
  name, 
  nickname, 
  to_char(due_date, 'YYYY-MM-DD') AS "dueDate", 
  reminder_days AS "reminderDays", 
  amount, 
  subscription_uuid AS "subscriptionUuid"
FROM subscriptions 
WHERE(user_id = ${userId});