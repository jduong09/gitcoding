ALTER TABLE users
  ADD user_uuid UUID NOT NULL DEFAULT gen_random_uuid();

ALTER TABLE subscriptions
  ADD subscription_uuid UUID NOT NULL DEFAULT gen_random_uuid();

ALTER TABLE subscriptions
  ALTER COLUMN amount TYPE money;