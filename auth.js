const express = require('express');
const passport = require('passport');

const router = express.Router();
require('dotenv').config();

/** 
 * Routes Definitions
*/

/*
* My understanding of passport API:
* 
*/

router.get(
  '/login',
  passport.authenticate('auth0', {
    scope: "openid"
  }),
  (req, res) => {
    res.send({ hello: 'hi' });
    res.end();
  }
);

router.get('/callback', (req, res, next) => {
  console.log(req.session);
  // req.query contains the code and state. What do we want to do with this object?
  passport.authenticate('auth0', (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.redirect('/login');
    }

    // When the login operation completes, user will be assigned to req.user.
    /*
    Note: passport.authenticate() middleware invokes req.login() automatically. 
    This function is primarily used when users sign up, during which req.login() 
    can be invoked to automatically log in the newly registered user.
    */
    req.logIn(user, (error) => {
      if (error) {
        return next(error);
      }

      const { returnTo } = req.session;
      console.log(req.user);
      delete req.session.returnTo;
      return res.redirect(returnTo || 'http://localhost:3000');
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  // remove the req.user property and clear the login sesssion (if any).
  req.logOut();
  console.log(req.session);

  // The rest of this is useless? Shouldn't user logout and be redirected to the landing page?
  let returnTo = `${req.protocol}://${req.hostname}`;
  const port = req.connection.localPort;

  if (port !== undefined && port !== 80 && port !== 433) {
    returnTo = process.env.NODE_ENV === 'production' ? `${returnTo}/` : `${returnTo}:${port}/`;
  }

  const logoutURL = new URL(`${process.env.BASE_URL}/v2/logout`);

  const searchString = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    returnTo, 
  });

  logoutURL.search = searchString;

  res.redirect(logoutURL);
});

/**
 * Module Exports
*/

module.exports = router;


