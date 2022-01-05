const express = require('express');
const passport = require('passport');
const dotenv = require('dotenv');

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
    scope: 'openid',
    prompt: 'select_account',
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

router.get('/callback', (req, res, next) => {
  console.log('Session id in callback: ', req.session.id);
  console.log('Req Session: ', req.query.state);
  req.session.save();
  console.log('hello this is before the authenticate callback function.')
  passport.authenticate('auth0', (err, user, info) => {
    if (err) {
      return next(err);
    }

    console.log('USER in callback function: ', user, err);
    console.log('INFO: ', info);

    if (!user) {
      return res.redirect('/login');
    }

    req.logIn(user, (error) => {
      if (error) {
        return next(error);
      }

      // TESTING THIS:
      // const { returnTo } = req.session;
      delete req.session.returnTo;
      // res.redirect(returnTo || `${process.env.BASE_URL}/users/1`);
      res.redirect(`${process.env.BASE_URL}/users/1`);
      res.end();
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logOut();
  res.clearCookie('connect.sid');
  console.log('Session in logout route: ', req.session);
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


