ALTER TABLE users
  ADD user_id UUID NOT NULL DEFAULT gen_random_uuid();

ALTER TABLE subscriptions
  ADD subscription_id UUID NOT NULL DEFAULT gen_random_uuid();