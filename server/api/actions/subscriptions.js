const db = require('../../db/db');

const getSubscriptionsByUserId = async (userId) => {
  const { rows: data } = await db.execute('server/sql/subscriptions/getSubscriptionsByUserId.sql', {userId});
  // returns all user's subscriptions (array containing objects of subscription)
  return data;
};

/*
const getSubscriptionBySubscriptionId = async (subId) => {
  const { rows: data } = await db.execute('../../sql/subscriptions/getSubscriptionBySubscriptionId.sql', {subId});
  return data;
};
*/

const createSubscription = async (requestBody) => {
  const params = {
    ...requestBody,
    due_date: requestBody.dueDate,
    reminder_days: requestBody.reminderDays
  }
  
  const { rows: [data] } = await db.execute('server/sql/subscriptions/putSubscription.sql', params);
  // returns createdSubscription (obj { name, nickname, due_date, reminder_days, amount, subscription_uuid })
  return data;
};

const updateSubscriptionBySubscriptionId = async (subscriptionInfo) => {
  const { rows: [data] } = await db.execute('server/sql/subscriptions/patchSubscription.sql', 
    { ...subscriptionInfo, 
      removed_at: subscriptionInfo.removedAt || null,
      reminderDays: parseInt(subscriptionInfo.reminderDays),
    }
  );
  // returns updatedSubscription (obj { name, nickname, due_date, reminder_days, amount, subscription_uuid })
  return data;
}

const deleteSubscriptionBySubscriptionId = async (subscription_uuid) => {
  const { rows: data} = await db.execute('server/sql/subscriptions/deleteSubscription.sql', { subscription_uuid });
  // returns []
  // TODO: Handle this.
  return data;
}

module.exports = {
  getSubscriptionsByUserId,
  createSubscription,
  updateSubscriptionBySubscriptionId,
  deleteSubscriptionBySubscriptionId
};