const express = require('express');
const { getUsers, createUser } = require('../actions/users');

const router = express.Router();

router.route('/')
  .get(async (req, res) => {
    try {
      const data = await getUsers();
      res.status(200).json(data);
    } catch(error) {
      res.status(400).json(error);
    }
  })
  .post(async (req, res) => {
    try {
      const { name } = req.body;
      const data = await createUser(name);
      res.status(200).json(data);
    } catch(error) {
      res.status(400).json(error);
    }
  });


module.exports = router;
