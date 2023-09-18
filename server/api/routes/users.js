const express = require('express');
const subscriptions = require('./subscriptions');
const { getUsers } = require('../actions/users');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

router.use('/:userUuid/subscriptions', subscriptions);

router.route('/')
  .get(async (req, res) => {
    console.log('/users route', req.session);
    try {
      const data = await getUsers();
      res.status(200).json(data);
    } catch(error) {
      res.status(400).json(error);
    }
  });

router.get('/:userUuid', async (req, res) => {
  console.log('hit /users/user_uuid route', req.session);
  await res.redirect(`${process.env.BASE_URL}/users/${req.params.userUuid}`);
});

router.get('/:userUuid/userInfo', async (req, res) => {
  const { user }  = req.session.passport;
  res.status(200).json({ name: user.displayName, pfp: user.picture });
});

module.exports = router;
