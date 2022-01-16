const express = require('express');
const { createSubscription, getSubscriptionsByUserId, updateSubscriptionBySubscriptionId, deleteSubscriptionBySubscriptionId } = require('../actions/subscriptions');

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(async (req, res) => {
    const { user_id } = req.session.userInfo;
    try {
      const data = await getSubscriptionsByUserId(user_id);
      res.status(200).json(data);
    } catch(error) {
      res.status(400).json(error);
    }
  })
  .put(async (req, res) => {
    const { user_id } = req.session.userInfo;
    req.body.userId = user_id;
    try {
      const data = await createSubscription(req.body);
      res.status(200).json(data);
    } catch(error) {
      res.status(400).json(error);
    }
  })
  .patch(async (req, res) => {
    try {
      const data = await updateSubscriptionBySubscriptionId(req.body);
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json(error);
    }
  })

router.delete('/:subscriptionUuid', async (req, res) => {
  try {
    await deleteSubscriptionBySubscriptionId(req.params.subscriptionUuid);
    res.status(200).send('Deleted Subscription Successfully');
  } catch (error) {
    res.status(400).json(error);
  }
})

module.exports = router;
