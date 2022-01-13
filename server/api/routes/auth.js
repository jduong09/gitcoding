const express = require('express');
const passport = require('passport');
const dotenv = require('dotenv');
const users = require('../actions/users');

dotenv.config();

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
      return res.redirect('/login');
    }

    req.logIn(user, async (error) => {
      if (error) {
        return next(error);
      }
      
      const userInfo = {
        name: user.displayName,
        identifier: user.id
      };
      
      // After retrieving user from db, redirect them to their user page.
      // Try to find a user with their user.id in the users db.
      let userExists;
      let data;
      
      try {
        userExists = await users.getUserByIdentifier(userInfo.identifier).then(user => data = user);
      } catch(e) {
        console.log('Error finding user: ', e);
      }

      if (!userExists) {
        // Try to create a user.
        try {
          data = await users.createUser(userInfo);
        } catch(e) {
          console.log('Error creating user: ', e);
        }
      }

      const { user_uuid } = data;
      // store user's id from db in session storage for quering subscriptions
      req.session.userInfo = {
        user_id: data.id
      }
      
      // URGENT: Need to look at prupose of deleting returnTo
      delete req.session.returnTo;
      await res.redirect(`${process.env.BASE_URL}/users/${user_uuid}`);
      res.end();
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logOut();
  res.clearCookie('connect.sid');

  const returnTo = process.env.BASE_URL;

  const logoutURL = new URL(`https://${process.env.ISSUER}/v2/logout`);

  const searchString = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    returnTo, 
  });

  logoutURL.search = searchString;

  res.redirect(logoutURL);
  res.end();
});

module.exports = router;


