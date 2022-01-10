const express = require('express');
const users = require('./routes/users');
const auth = require('./routes/auth');
const subscriptions = require('./routes/subscriptions');

const router = express.Router();

router.use('/api/users', users);
router.use('/auth', auth);
router.use('/users/:userId/subscriptions', subscriptions);

module.exports = router;
