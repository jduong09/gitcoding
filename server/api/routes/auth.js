const express = require('express');
const passport = require('passport');
const dotenv = require('dotenv');
const users = require('../actions/users');

dotenv.config();
const { BASE_URL, ISSUER, CLIENT_ID } = process.env;

const router = express.Router();

router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Access-Control-Allow-Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

/** 
 * Routes Definitions
*/

router.get(
  '/login',
  passport.authenticate('auth0', {
    scope: 'openid profile',
    prompt: 'select_account',
    successRedirect: '/callback',
  })
);

router.get('/callback', passport.authenticate('auth0', { failureRedirect: '/login' }), async (req, res) => {
  if (req.user) {
    const user = await users.getUserByIdentifier(req.user.identifier).then(data => data);
    req.session.userInfo = {
      user_id: user.id,
      name: user.name,
      picture: req.user.picture
    };
    
    // URGENT: Need to look at purpose of deleting returnTo
    // delete req.session.returnTo;
    await res.redirect(`/users/${user.user_uuid}`);
  }
});

router.post('/logout', async (req, res, next) => {
  await req.logout(async (err) => {
    if (err) { 
      return next(err);
    }
    req.session.destroy();
    res.clearCookie('connect.sid', { domain: 'localhost', path: '/' });

    const returnTo = BASE_URL;

    const logoutURL = new URL(`https://${ISSUER}/v2/logout`);

    const searchString = new URLSearchParams({
      client_id: CLIENT_ID,
      returnTo, 
    });

    logoutURL.search = searchString;
    await res.json({ url: logoutURL });
    res.end();
  });
});

router.get('/checkAuth', (req, res) => {
  if (req.user) {
    res.json({ authenticated: true });
    res.end();
  } else {
    res.json({ authenticated: false });
    res.end();
  }
});

module.exports = router;


