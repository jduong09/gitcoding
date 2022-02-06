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
      res.status(200).json(data);
    } catch(error) {
      res.status(400).json({ errorMessage: 'Error creating subscription! Try again!' });
    }
  })
  .patch(async (req, res) => {
    console.log(req.body);
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

// Grabs user's user id, fetches their subscriptions in the backend. 
// It will then iterate through their subscriptions, and hopefully, store late due dates.
// It will then also update late due dates to the next time it is due.
router.get('/update', async (req, res) => {
  const { user_id } = req.session.userInfo;
  const lateDueDates = [];
  try {
    const allSubscriptions = await getSubscriptionsByUserId(user_id);
    for (let i = 0; i < allSubscriptions.length; i += 1) {
      const subscription = allSubscriptions[i];
      const updatedSubscription = await updateNextDueDate(subscription.dueDate, subscription.subscriptionUuid);
      const { dueDate, name } = updatedSubscription;
      if (dueDate.lateDueDate) {
        lateDueDates.push({ name, date: dueDate.lateDueDate });
      }
    }

    res.status(200).json({ lateDueDates });
    res.end();
  } catch(error) {
    console.log('Error: ', error);
  }
});

module.exports = router;
