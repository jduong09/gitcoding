SELECT name, nickname, due_date, reminder_days, amount, subscription_uuid FROM subscriptions 
  WHERE(user_id = ${userId});