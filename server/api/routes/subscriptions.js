const express = require('express');
const { updateNextDueDate } = require('../../utils/date');
const {
  createSubscription,
  getSubscriptionsByUserId,
  updateSubscriptionBySubscriptionId,
  deleteSubscriptionBySubscriptionId,
} = require('../actions/subscriptions');
const { confirmUser } = require('./middleware');

const router = express.Router({ mergeParams: true });

router.route('/')
  .all(confirmUser)
  .get(async (req, res) => {
    const { user_id } = req.session.userInfo;
    try {
      // updateSubscriptions calls getSubscriptionsByUserId
      await updateSubscriptions(req);
      const data = await getSubscriptionsByUserId(user_id);
      res.status(200).json(data);
    } catch(error) {
      res.status(400).json({ errorMessage: 'Error fetching subscription! Try again!' });
    }
  })
  .put(async (req, res) => {
    const { user_id } = req.session.userInfo;
    req.body.userId = user_id;
    try {
      const data = await createSubscription(req.body);

      const { dueDate, subscriptionUuid } = data;
      const updatedSubscription = await updateNextDueDate(dueDate, subscriptionUuid)
      res.status(200).json(updatedSubscription);
    } catch(error) {
      res.status(400).json({ errorMessage: 'Error creating subscription! Try again!' });
    }
  })
  .patch(async (req, res) => {
    try {
      const data = await updateSubscriptionBySubscriptionId(req.body);
      res.status(200).json(data);
    } catch(error) {
      res.status(400).json({ errorMessage: 'Error updating subscription! Try again!' });
    }
  });

router.delete('/:subscriptionUuid', async (req, res) => {
  try {
    await deleteSubscriptionBySubscriptionId(req.params.subscriptionUuid);
    res.status(200).json('Successfully deleted subscription!');
  } catch(error) {
    res.status(400).json({ errorMessage: 'Error deleting subscription!' });
  }
});

const updateSubscriptions = async (req) => {
  const { user_id } = req.session.userInfo;
  const lateDueDates = [];
  try {
    const allSubscriptions = await getSubscriptionsByUserId(user_id);
  
    await allSubscriptions.map(async (subscription) => {
      const updatedSubscription = await updateNextDueDate(subscription.dueDate, subscription.subscriptionUuid);
      const { name, dueDate } = updatedSubscription;

      if (dueDate.lateDueDate) {
        lateDueDates.push({ name, date: dueDate.lateDueDate });
      }

      return updatedSubscription;
    });
  } catch(error) {
    console.log('Error: ', error);
  }
};

module.exports = router;
