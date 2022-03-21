const express = require('express');
const passport = require('passport');
const dotenv = require('dotenv');
const users = require('../actions/users');

dotenv.config();
const {BASE_URL, ISSUER, CLIENT_ID} = process.env;

const router = express.Router();

router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
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

router.get('/callback', (req, res, next) => {
  passport.authenticate('auth0', (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.redirect('/');
    }

    req.logIn(user, async (error) => {
      if (error) {
        return next(error);
      }
      
      const userInfo = {
        name: user.displayName,
        identifier: user.id
      };
      
      let userExists;
      let data;

      // TODO: Handle alert on catch statement.
      try {
        userExists = await users.getUserByIdentifier(userInfo.identifier).then(user => data = user);
      } catch(e) {
        return res.redirect('/');
      }

      // TODO: Handle alert on catch statement.
      if (!userExists) {
        try {
          data = await users.createUser(userInfo);
        } catch(e) {
          return res.redirect('/');
        }
      }

      const { user_uuid, id } = data;
      req.session.userInfo = {
        user_id: id
      };
      
      // URGENT: Need to look at purpose of deleting returnTo
      delete req.session.returnTo;
      await res.redirect(`${BASE_URL}/users/${user_uuid}`);
      res.end();
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logOut();
  res.clearCookie('connect.sid');

  const returnTo = BASE_URL;

  const logoutURL = new URL(`https://${ISSUER}/v2/logout`);

  const searchString = new URLSearchParams({
    client_id: CLIENT_ID,
    returnTo, 
  });

  logoutURL.search = searchString;

  res.redirect(logoutURL);
  res.end();
});

module.exports = router;


