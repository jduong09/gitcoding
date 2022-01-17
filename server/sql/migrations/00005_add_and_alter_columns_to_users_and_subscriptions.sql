ALTER TABLE users ADD COLUMN user_uuid UUID NOT NULL DEFAULT gen_random_uuid();

ALTER TABLE subscriptions ADD COLUMN subscription_uuid UUID NOT NULL DEFAULT gen_random_uuid();