const express = require('express');
const { createSubscription, getSubscriptionsByUserId, updateSubscriptionBySubscriptionId, deleteSubscriptionBySubscriptionId } = require('../actions/subscriptions');

const router = express.Router({ mergeParams: true });

router.route('/')
  // READ all user's subscriptions
  .get(async (req, res) => {
    const { user_id } = req.session.userInfo;
    try {
      const data = await getSubscriptionsByUserId(user_id);
      res.status(200).json(data);
    } catch(error) {
      res.status(400).json(error);
    }
  })
  // CREATE a subscription
  .put(async (req, res) => {
    // Line 36-37: Autoassign the user id based on their uuid from the req.params
    const { user_id } = req.session.userInfo;
    req.body.userId = user_id;
    try {
      const data = await createSubscription(req.body);
      res.status(200).json(data);
    } catch(error) {
      res.status(400).json(error);
    }
  })
  // Update a subscription
  .patch(async (req, res) => {
    try {
      const data = await updateSubscriptionBySubscriptionId(req.body);
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json(error);
    }
  })

  // Delete a subscription
  router.delete('/:subscriptionUuid', async (req, res) => {
    try {
      await deleteSubscriptionBySubscriptionId(req.params.subscriptionUuid);
      res.status(200).send('Deleted Subscription Successfully');
    } catch (error) {
      res.status(400).json(error);
    }
  })

/*
// READ a single user subscription
// Route: /users/:userId/subscriptions/:subscriptionId
router.get('/:subscriptionId', async (req, res) => {
  const subscriptionId = req.query.subscriptionId;
  try {
    // execute db query getSubscriptions.
    const data = await getSubscriptionById(subscriptionId);
    // When response has returned with data from the await
    // Issue a status 200, and place data in body as JSON 
    res.status(200).json(data);
  } catch(error) {
    // If query encounters an error, 
    // Issue a 400 status, and place error message in body as JSON 
    res.status(400).json(error)
  }
});
*/

module.exports = router;
