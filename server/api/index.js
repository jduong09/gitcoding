const express = require('express');
const users = require('./routes/users');
const auth = require('./routes/auth');

const router = express.Router();

router.use('/auth', auth);
router.use('/users', users);

module.exports = router;
