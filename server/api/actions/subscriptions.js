const db = require('../../db/db');

const getSubscriptionsByUserId = async (userId) => {
  const { rows: data } = await db.execute('server/sql/subscriptions/getSubscriptionsByUserId.sql', {userId});
  return data;
};

/*
const getSubscriptionBySubscriptionId = async (subId) => {
  const { rows: data } = await db.execute('../../sql/subscriptions/getSubscriptionBySubscriptionId.sql', {subId});
  return data;
};
*/

const createSubscription = async ({ name, nickname, due_date, reminder_days, amount, user_id }) => {
  const params = {
    name,
    nickname,
    due_date,
    reminder_days: parseInt(reminder_days),
    amount,
    user_id,
  }
  
  const { rows: data } = await db.execute('server/sql/subscriptions/putSubscription.sql', params);
  return data;
};

const updateSubscriptionBySubscriptionId = async (subscriptionInfo) => {
  const params = { 
    name: subscriptionInfo.name,
    nickname: subscriptionInfo.nickname,
    removed_at: subscriptionInfo.removedAt || null,
    due_date: subscriptionInfo.due_date,
    reminder_days: parseInt(subscriptionInfo.reminder_days),
    amount: subscriptionInfo.amount,
    uuid: subscriptionInfo.uuid,
  }
  
  const { rows: data } = await db.execute('server/sql/subscriptions/patchSubscription.sql', params);
  // Unnecesarily returning array with one object, the updated object in it.
  // TO-DO: Handle this.
  return data;
}

const deleteSubscriptionBySubscriptionId = async (subscription_uuid) => {
  const { rows: data } = await db.execute('server/sql/subscriptions/deleteSubscription.sql', { subscription_uuid });
  // query returns [ { bool: true } ]
  // TO-DO: Handle this.
  return data;
}

module.exports = {
  getSubscriptionsByUserId,
  createSubscription,
  updateSubscriptionBySubscriptionId,
  deleteSubscriptionBySubscriptionId
};