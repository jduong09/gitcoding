UPDATE subscriptions
SET due_date = ${dueDate}
WHERE subscription_uuid = ${subscriptionUuid}
RETURNING name, due_date AS "dueDate";