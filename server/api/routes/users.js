const express = require('express');
const dotenv = require('dotenv');
const subscriptions = require('./subscriptions');
const { getUsers } = require('../actions/users');
const { checkAuthentication } = require('./middleware');


dotenv.config();

const router = express.Router();

router.use('/:userUuid/subscriptions', subscriptions);

router.route('/')
  .get(async (req, res) => {
    try {
      const data = await getUsers();
      res.status(200).json(data);
    } catch(error) {
      res.status(400).json(error);
    }
  });

router.use('/:userUuid', checkAuthentication, (req, res, next) => next());
/*

THIS ROUTE IS USED FOR LOCAL DEVELOPMENT: Frontend http://localhost:3000 makes request 'http://localhost:5000/users/:userId'


router.get('/:userUuid', checkAuthentication, async (req, res) => {
  await res.redirect(`${process.env.BASE_URL}/users/${req.params.userUuid}`);
});
*/

router.get('/:userUuid/userInfo', async (req, res) => {
  const { user }  = req.session.passport;
  res.status(200).json({ name: user.displayName, pfp: user.picture });
});

module.exports = router;
