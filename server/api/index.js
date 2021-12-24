const express = require('express');
const users = require('./routes/users');
const auth = require('./routes/auth');

const router = express.Router();

router.use('/api/users', users);
router.use('/auth', auth);

module.exports = router;
