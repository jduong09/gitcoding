/**
 * Required External Modules
 */

const express = require('express');
const router = express.Router();
const passport = require('passport');
const querystring = require('querystring');

require("dotenv").config();

/** 
 * Routes Definitions
*/

router.get(
  '/login',
  passport.authenticate('auth0', {
    scope: "openid email profile"
  }),
  (req, res) => {
    console.log(req.query);
    res.send({ hello: 'hi' });
    res.end();
  }
);

router.get('callback', (req, res, next) => {
  passport.authenticate('auth0', (err, user, info) => {
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
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      res.redirect(returnTo || '/');
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logOut();

  let returnTo = `${req.protocol}://${req.hostname}`;
  const port = req.connection.localPort;

  if (port !== undefined && port !== 80 && port !== 433) {
    returnTo = process.env.NODE_ENV === 'production' ? `${returnTo}/` : `${returnTo}:${port}/`;
  }

  const logoutURL = new URL(
    `${process.env.BASE_URL}/v2/logout`
  );

  const searchString = querystring.stringify({
    client_id: process.env.CLIENT_ID,
    returnTo: returnTo
  });

  logoutURL.search = searchString;

  res.redirect(logoutURL);
});

/**
 * Module Exports
*/

module.exports = router;


