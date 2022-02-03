const db = require('../../db/db');

const getSubscriptionsByUserId = async (userId) => {
  const { rows: data } = await db.execute('server/sql/subscriptions/getSubscriptionsByUserId.sql', {userId});
  return data;
};

const createSubscription = async (requestBody) => {
  const { rows: [data] } = await db.execute('server/sql/subscriptions/putSubscription.sql', 
    {
      ...requestBody,
      occurence: parseInt(requestBody.occurence),
      reminderDays: parseInt(requestBody.reminderDays),
      amount: requestBody.amount * 100
    }
  );
  return data;
};

const updateSubscriptionBySubscriptionId = async (subscriptionInfo) => {
  const { rows: [data] } = await db.execute('server/sql/subscriptions/patchSubscription.sql', 
    {
      ...subscriptionInfo, 
      occurence: parseInt(subscriptionInfo.occurence),
      removedAt: subscriptionInfo.removedAt || null,
      reminderDays: parseInt(subscriptionInfo.reminderDays),
      amount: subscriptionInfo.amount * 100
    }
  );
  return data;
}


const updateDatesForSubscription = async (requestBody) => {
  const { rows: data } = await db.execute('server/sql/subscriptions/updateSubscriptionDueDate.sql', requestBody);
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
  updateDatesForSubscription
};