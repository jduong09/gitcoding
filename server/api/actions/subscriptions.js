const db = require('../../db/db');

// Commented out code is for other CRUD functions.
/*
const getSubscriptionsByUserId = async (userId) => {
  const { rows: data } = await db.execute('../../sql/subscriptions/getSubscriptionsByUserId.sql', {userId});
  return data;
};
*/

/*
const getSubscriptionBySubscriptionId = async (subId) => {
  const { rows: data } = await db.execute('../../sql/subscriptions/getSubscriptionBySubscriptionId.sql', {subId});
  return data;
};
*/

const createSubscription = async (subscriptionInfo) => {
  // Convert client date to timestampz (timestamp with time zone)
  const params = {
    name: subscriptionInfo.name,
    nickname: subscriptionInfo.nickname,
    due_date: subscriptionInfo.dueDate,
    reminder_days: parseInt(subscriptionInfo.reminderDays),
    amount: subscriptionInfo.amount,
    user_id: parseInt(subscriptionInfo.userId),
  }
  
  const { rows: data } = await db.execute('server/sql/subscriptions/putSubscription.sql', params);
  return data;
};

module.exports = {
  createSubscription
};