ALTER TABLE users
  ADD user_uiid UUID NOT NULL DEFAULT gen_random_uuid();

ALTER TABLE subscriptions
  ADD subscription_uiid UUID NOT NULL DEFAULT gen_random_uuid();