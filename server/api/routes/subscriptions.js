const express = require('express');
const { createSubscription, getSubscriptionsByUserId, updateSubscriptionBySubscriptionId, deleteSubscriptionBySubscriptionId } = require('../actions/subscriptions');

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(async (req, res) => {
    const { user_id } = req.session.userInfo;
    await getSubscriptionsByUserId(user_id)
      .then(data => res.status(200).json(data))
      .catch(error => res.status(400).json(error));
  })
  .put(async (req, res) => {
    const { user_id } = req.session.userInfo;
    req.body.userId = user_id;

    await createSubscription(req.body)
      .then(data => {
        res.status(200).json(data)
      })
      .catch(error => res.status(400).json(error)); 
  })
  .patch(async (req, res) => {
    await updateSubscriptionBySubscriptionId(req.body)
      .then(data => res.status(200).json(data))
      .catch(error => res.status(400).json(error));
  });

router.delete('/:subscriptionUuid', async (req, res) => {
  await deleteSubscriptionBySubscriptionId(req.params.subscriptionUuid)
    .then(() => res.status(200).json('Deleted Subscription Successfully'))
    .catch(error => res.status(400).json(error));
});

module.exports = router;
