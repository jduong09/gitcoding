const express = require('express');
const { putSubscription } = require('../actions/subscriptions');

// Create a new router object, where we will have CRUD routes for our subscriptions table 
// under the route /users/:userId/subscriptions/
const router = express.Router();

router.route('/:userId/subscriptions')
  // READ all user's subscriptions
  .get(async (req, res) => {
    try {
      const data = await getSubscriptionsByUser();
      res.status(200).json(data);
    } catch(error) {
      res.status(400).json(error);
    }
  })
  // CREATE a subscription
  .put(async (req, res) => {
    // req.body will contain the information necessary to make a new subscription
    try {
      const data = await putSubscription(req.body);
      res.status(200).json(data);
    } catch(error) {
      res.status(400).json(error);
    }
  })
  // Update a subscription
  // Route: /users/:userId/:subscriptionsId
  .patch(async (req, res) => {
    try {
      // req.body contains the information needed to update the subscription.
      const data = await updateSubscription(req.body);
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json(error);
    }
  })
  // Delete a subscription
  // Route: /users/:userId/subscriptions/:subscriptionId
  .delete(async(req, res) => {
    try {
      const data = await deleteSubscription();
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json(error);
    }
  });

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

module.exports = router;
