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

const createSubscription = async (requestBody) => {
  
  const { rows: data } = await db.execute('server/sql/subscriptions/putSubscription.sql', requestBody);
  return data;
};

const updateSubscriptionBySubscriptionId = async (subscriptionInfo) => {
  
  const { rows: data } = await db.execute('server/sql/subscriptions/patchSubscription.sql', 
    { ...subscriptionInfo, 
      removed_at: subscriptionInfo.removedAt || null
    }
  );
  // Unnecesarily returning array with one object, the updated object in it.
  // TODO: Handle this.
  return data;
}

const deleteSubscriptionBySubscriptionId = async (subscription_uuid) => {
  const { rows: data } = await db.execute('server/sql/subscriptions/deleteSubscription.sql', { subscription_uuid });
  // query returns [ { bool: true } ]
  // TODO: Handle this.
  return data;
}

module.exports = {
  getSubscriptionsByUserId,
  createSubscription,
  updateSubscriptionBySubscriptionId,
  deleteSubscriptionBySubscriptionId
};