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

const updateAllUsersSubscriptions = async (req) => {
  const { user_id } = req.session.userInfo;

  try {
    const allSubscriptions = await getSubscriptionsByUserId(user_id);

    const updatedSubscriptions = await Promise.all(allSubscriptions.map(({ dueDate, subscriptionUuid }) =>
      updateNextDueDate(dueDate, subscriptionUuid)));
    
    const lateDueDates = updatedSubscriptions.reduce((lateSubs, subscription) => {
        if (subscription?.dueDate?.lateDueDate) {
          lateSubs.push({ name: subscription.name, date: subscription.dueDate.lateDueDate});
        }
        return lateSubs;
    }, []);

    return lateDueDates;
  } catch(error) {
    console.log('Error while updating user\'s subscriptions: ', error);
    return null;
  }
}

router.route('/')
  .all(confirmUser)
  .get(async (req, res) => {
    const { user_id } = req.session.userInfo;
    try {
      await updateAllUsersSubscriptions(req);
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


module.exports = router;
