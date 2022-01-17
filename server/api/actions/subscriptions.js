const db = require('../../db/db');

const getSubscriptionsByUserId = async (userId) => {
  const { rows: data } = await db.execute('server/sql/subscriptions/getSubscriptionsByUserId.sql', {userId});
  // returns all user's subscriptions (array containing objects of subscription)
  return data;
};

const createSubscription = async (requestBody) => {
  console.log(typeof requestBody.amount);
  const { rows: [data] } = await db.execute('server/sql/subscriptions/putSubscription.sql', 
    { ...requestBody, 
      reminderDays: parseInt(requestBody.reminderDays),
      amount: requestBody.amount * 100
    }
  );
  return data;
};

const updateSubscriptionBySubscriptionId = async (subscriptionInfo) => {
  const { rows: [data] } = await db.execute('server/sql/subscriptions/patchSubscription.sql', 
    { ...subscriptionInfo, 
    removedAt: subscriptionInfo.removedAt || null,
    reminderDays: parseInt(subscriptionInfo.reminderDays)
    }
  );
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
  deleteSubscriptionBySubscriptionId
};