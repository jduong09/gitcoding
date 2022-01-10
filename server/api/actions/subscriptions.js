const db = require('../../db');

const getSubscriptionsByUserId = async (userId) => {
  const { rows: data } = await db.execute('../../sql/subscriptions/getSubscriptionsByUserId.sql', {userId});
  return data;
};

const getSubscriptionBySubscriptionId = async (subId) => {
  const { rows: data } = await db.execute('../../sql/subscriptions/getSubscriptionBySubscriptionId.sql', {subId});
  return data;
};

const createSubscription = async (subscriptionInfo) => {
  const params = {
    name: subscriptionInfo.name,
    nickname: subscriptionInfo.nickname,
    due_date: subscriptionInfo.dueDate,
    reminder_days: subscriptionInfo.reminderDays,
    amount: subscriptionInfo.amount,
    user_id: subscriptionInfo.userId,
  }
  const { rows: data } = await db.execute('../../sql/subscriptions/createSubscription', params);
  return data;
};

module.exports = {
  createSubscription
};