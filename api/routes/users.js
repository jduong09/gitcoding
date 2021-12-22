const express = require('express');
const { getUsers, createUser } = require('../actions/users');

const router = express.Router();

router.route('/')
  .get(async (req, res) => {
    try {
      const data = await getUsers();
      console.log('FROM USER ROUTE GET: ', data);
      res.status(200).json(data);
    } catch(error) {
      console.log('ERROR FROM USER ROUTE GET: ', error);
      res.status(400).json(error);
    }
  })
  .post(async (req, res) => {
    try {
      const { name } = req.body;
      console.log('FROM USER ROUTE POST 1: ', req.body);
      const data = await createUser(name);
      console.log('FROM USER ROUTE POST 2: ', data);
      res.status(200).json(data);
    } catch(error) {
      console.log('ERROR FROM USER ROUTE POST: ', error);
      res.status(400).json(error);
    }
  });


module.exports = router;
