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
      try {
        users.findUser(user.id).then(data => {
          if (data.length === 0) {
            try {
              users.createUser(userInfo);
            } catch (e) {
              console.log('Error Creating User: ', e);
            }
          }
        });
      } catch (e) {
        console.log('Error finding user: ', e);
      }
  
      const { returnTo } = req.session;
      delete req.session.returnTo;
      res.redirect(returnTo || `${process.env.BASE_URL}/users/1`);
    });
    res.end();
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


