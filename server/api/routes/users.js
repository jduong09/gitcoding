const express = require('express');
const subscriptions = require('./subscriptions');
const { getUsers, createUser } = require('../actions/users');

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
  /*
  * Needs to be changed because createUser takes a name and an identifier.
  * Possibly remove route?
  .post(async (req, res) => {
    try {
      const { name } = req.body;
      const data = await createUser(name);
      res.status(200).json(data);
    } catch(error) {
      res.status(400).json(error);
    }
  });
  */

module.exports = router;
