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

const createSubscription = async (subscriptionInfo) => {
  const params = {
    name: subscriptionInfo.name,
    nickname: subscriptionInfo.nickname,
    due_date: subscriptionInfo.due_date,
    reminder_days: parseInt(subscriptionInfo.reminder_days),
    amount: subscriptionInfo.amount,
    user_id: subscriptionInfo.user_id,
  }
  
  const { rows: data } = await db.execute('server/sql/subscriptions/putSubscription.sql', params);
  return data;
};

const updateSubscriptionBySubscriptionId = async (subscriptionInfo) => {
  /*
  console.log(subscriptionInfo);
  const uuid = subscriptionInfo.uuid;
  */
  
  const params = { 
    name: subscriptionInfo.name,
    nickname: subscriptionInfo.nickname,
    removed_at: subscriptionInfo.removedAt || null,
    due_date: subscriptionInfo.due_date,
    reminder_days: parseInt(subscriptionInfo.reminder_days),
    amount: subscriptionInfo.amount,
    uuid: subscriptionInfo.uuid,
  }
  console.log(params);
  
  const { rows: data } = await db.execute('server/sql/subscriptions/patchSubscription.sql', params);
  console.log(data);
  return data;
}

module.exports = {
  getSubscriptionsByUserId,
  createSubscription,
  updateSubscriptionBySubscriptionId,
};