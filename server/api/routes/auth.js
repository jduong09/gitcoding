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

    req.logIn(user, (error) => {
      if (error) {
        return next(error);
      }
      
      // store user_id?
      const userInfo = {
        name: user.displayName,
        identifier: user.id
      };
      
      // User.createUser(userInfo);
      // After retrieving user from db, redirect them to their user page.
      try {
        users.getUserByIdentifier(user.id).then(data => {
          if (data.length === 0) {
            try {
              users.createUser(userInfo);
            } catch (e) {
              console.log('Error Creating User: ', e);
            }
          }
          // data should return one user from db.
          // userUrlId is user_id column from user's db. ex: 'xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx'
          const userUrlId = data[0].user_id.slice('-');
          // URGENT: Need to look at purpose of deleting returnTo.
          delete req.session.returnTo;
          res.redirect(`${process.env.BASE_URL}/users/${userUrlId}`);
          res.end();
        });
      } catch (e) {
        console.log('Error finding user: ', e);
      }
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


