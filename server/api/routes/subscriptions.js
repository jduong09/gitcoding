const express = require('express');
const {
  createSubscription,
  getSubscriptionsByUserId,
  updateSubscriptionBySubscriptionId,
  deleteSubscriptionBySubscriptionId,
  updateDatesForSubscription
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
    try {
      const data = await updateSubscriptionBySubscriptionId(req.body);
      res.status(200).json(data);
    } catch(error) {
      res.status(400).json({ errorMessage: 'Error updating subscription! Try again!' });
    }
  });

/** 
 * function to run sql query, that will update all subscriptions? 

*/
router.patch('/:subscriptionUuid', async (req, res) => {
  const { subscriptionUuid } = req.params;
  req.body.subscriptionUuid = subscriptionUuid;
  try {
    await updateDatesForSubscription(req.body);
    res.status(200).json('Successfully updated due dates!');
  } catch(error) {
    res.status(400).json({ errorMessage: 'Error updating subscriptions!' });
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
