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

/*
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

      If User exists on passport log in, find User by Id, set User into to userExists variable.

      If User exists on passport login, but user is not found in the database, try to create user in the database.
      Set newly created user to data variable. extract the user_uuid, id.
      
      Set userInfo object to include the user_id and users picture for frontend.

      Delete sessions returnTo?

      Redirect to users personal web page.
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
        user_id: id,
        picture: user.picture
      };

      // URGENT: Need to look at purpose of deleting returnTo
      delete req.session.returnTo;
      await res.redirect(`/users/${user_uuid}`);
      res.end();
    });
  })(req, res, next);
});
*/

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


