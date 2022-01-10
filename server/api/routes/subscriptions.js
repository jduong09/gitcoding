const express = require('express');
const { createSubscription } = require('../actions/subscriptions');

// Create a new router object, where we will have CRUD routes for our subscriptions table 
// under the route /users/:userId/subscriptions/
const router = express.Router();

// Read all user's subscriptions
// Route: /users/:userId/subscriptions
router.get(async (req, res) => {
  try {
    const data = await getSubscriptionsByUser();
    res.status(200).json(data);
  } catch(error) {
    res.status(400).json(error);
  }
});

// READ a single user subscription
// Route: /users/:userId/subscriptions/:subscriptionId
router.get(async (req, res) => {
  try {
    // execute db query getSubscriptions.
    const data = await getSubscriptionById();
    // When response has returned with data from the await
    // Issue a status 200, and place data in body as JSON 
    res.status(200).json(data);
  } catch(error) {
    // If query encounters an error, 
    // Issue a 400 status, and place error message in body as JSON 
    res.status(400).json(error)
  }
});

// CREATE a subscription
// Route: /users/:userId/subscriptions/new
router.post('/new', async (req, res) => {
  // req.body will contain the information necessary to make a new subscription
  try {
    const data = await createSubscription(req.body);
    res.status(200).json(data);
  } catch(error) {
    res.status(400).json(error);
  }
});

// Update a subscription
// Route: /users/:userId/:subscriptionsId
router.put(async (req, res) => {
  try {
    // req.body contains the information needed to update the subscription.
    const data = await updateSubscription(req.body);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
});

// Delete a subscription
// Route: /users/:userId/subscriptions/:subscriptionId
router.delete(async(req, res) => {
  try {
    const data = await deleteSubscription();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
