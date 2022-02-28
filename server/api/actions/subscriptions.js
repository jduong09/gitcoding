const db = require('../../db/db');

const getSubscriptionsByUserId = async (userId) => {
  const { rows: data } = await db.execute('server/sql/subscriptions/getSubscriptionsByUserId.sql', {userId});
  return data;
};

const createSubscription = async (requestBody) => {
  const { rows: [data] } = await db.execute('server/sql/subscriptions/putSubscription.sql', 
    {
      ...requestBody,
      occurrence: parseInt(requestBody.occurrence),
      reminderDays: parseInt(requestBody.reminderDays),
      amount: Math.round((requestBody.amount * 100) * 100) / 100
    }
  );
  return data;
};

const updateSubscriptionBySubscriptionId = async (subscriptionInfo) => {
  const { rows: [data] } = await db.execute('server/sql/subscriptions/patchSubscription.sql', 
    {
      ...subscriptionInfo, 
      occurrence: parseInt(subscriptionInfo.occurrence),
      removedAt: subscriptionInfo.removedAt || null,
      reminderDays: parseInt(subscriptionInfo.reminderDays),
      amount: Math.round((subscriptionInfo.amount * 100) * 100) / 100
    }
  );
  return data;
}

const updateDatesBySubscriptionId = async (requestBody) => {
  const { rows: [data] } = await db.execute('server/sql/subscriptions/patchSubscriptionDueDate.sql', requestBody);
  return data;
}

const deleteSubscriptionBySubscriptionId = async (subscription_uuid) => {
  const { rows: data } = await db.execute('server/sql/subscriptions/deleteSubscription.sql', { subscription_uuid });
  return data;
}

module.exports = {
  getSubscriptionsByUserId,
  createSubscription,
  updateSubscriptionBySubscriptionId,
  deleteSubscriptionBySubscriptionId,
  updateDatesBySubscriptionId
};