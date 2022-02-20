SELECT 
  name, 
  nickname, 
  due_date AS "dueDate", 
  reminder_days AS "reminderDays", 
  amount, 
  subscription_uuid AS "subscriptionUuid"
FROM subscriptions 
WHERE(user_id = ${userId})
ORDER BY id;