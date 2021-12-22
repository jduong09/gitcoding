const express = require('express');
const passport = require('passport');

const router = express.Router();
require('dotenv').config();

/** 
 * Routes Definitions
*/

/*
* My understanding of passport API:
* Frontend: User sees log in button. They click log in button.
* Frontend: Browser sends a request to http://localhost:5000/auth/login from the <a> tag.
* Backend: Request hits express route /auth/login, where passport api logins user with the auto0 strategy.
* 
*/

router.get(
  '/login',
  passport.authenticate('auth0', {
    scope: 'openid',
    prompt: 'select_account',
  }),
  (req, res) => {
    res.end();
  }
);

router.get('/callback', (req, res, next) => {
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
      delete req.session.returnTo;
      res.redirect(returnTo || 'http://localhost:3000/users/1');
      res.end();
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  // req.logOut() removes the req.user property and clear the login sesssion (if any).
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


