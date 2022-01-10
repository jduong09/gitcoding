const db = require('../../db/db');
const dateUtils = require('../utils/dateAndTimeUtils');

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
  const formattedDate = dateUtils.convertDateToTimestampz(subscriptionInfo.dueDate);
  const params = {
    name: subscriptionInfo.name,
    nickname: subscriptionInfo.nickname,
    due_date_year: formattedDate.year,
    due_date_month: formattedDate.month,
    due_date_day: formattedDate.day,
    reminder_days: parseInt(subscriptionInfo.reminderDays),
    amount: parseInt(subscriptionInfo.amount),
    user_id: parseInt(subscriptionInfo.userId),
  }

  const { rows: data } = await db.execute('server/sql/subscriptions/createSubscription.sql', params);
  return data;
};

module.exports = {
  createSubscription
};