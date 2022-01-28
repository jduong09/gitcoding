ALTER TABLE subscriptions
ALTER COLUMN due_date TYPE jsonb 
USING jsonb_build_object(
  'frequency', 'monthly',
  'occurence', 1,
  'dates', ARRAY[EXTRACT(DAY FROM due_date)]
);