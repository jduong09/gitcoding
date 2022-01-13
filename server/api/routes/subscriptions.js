const express = require('express');
const { createSubscription, getSubscriptionsByUserId, updateSubscriptionBySubscriptionId } = require('../actions/subscriptions');

// Create a new router object, where we will have CRUD routes for our subscriptions table 
// under the route /users/:userId/subscriptions/
/** 
 * Wednesday Daily Work
 * error messages for subscription routes
 *    How do we want to handle errors messages on the frontend (ask Dan)
 *    How are we error handling on the backend? (redirecting to login...)
 * display all user's subscriptions (done)
 *    Try/Catch statement for fetching all subscriptions. What happens if it fails?
 *    format timestampz for serving to client. (done)
 *    format display on client side (css) (done)
 * create a new subscription (done)
 *    insert user_id from backend, not have it as input field on the client side (done)
 * update an existing subscription 
 *    Add frontend button, make request to backend to update.
 * delete a subscription
*/
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
    // req.body will contain the information necessary to make a new subscription
    // TODO: Need to autoassign the user id based on their uuid from the req.params
    const { user_id } = req.session.userInfo;
    req.body.user_id = user_id;
    try {
      const data = await createSubscription(req.body);
      res.status(200).json(data);
    } catch(error) {
      res.status(400).json(error);
    }
  })
  // Update a subscription
  .patch(async (req, res) => {
    console.log('HIT UPDATE ROUTE');
    try {
      // req.body contains the information needed to update the subscription.
      const data = await updateSubscriptionBySubscriptionId(req.body);
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
