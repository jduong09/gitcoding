const express = require('express');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const PGSession = require('connect-pg-simple')(expressSession);
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const path = require('path');
const dotenv = require('dotenv');
const apiRouter = require('./api');
const db = require('./db/db');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

db.migrate();

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*
 * Session Configuration
*/

const session = {
  store: new PGSession({
    pool: db.pgPool,
    tableName: 'sessions'
  }),
  secret: process.env.SESSION_SECRET,
  cookie: {
    sameSite: 'Lax',
    httpOnly: false,
  },
  resave: false,
  saveUninitialized: false,
};

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
  // Serve secure cookies, requires HTTPS
  session.cookie.secure = true;
}

/*
 * Passport Configuration
*/

const strategy = new Auth0Strategy({
    domain: process.env.ISSUER,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    passReqToCallback: true
  },
  // verify callback, use 'passReqToCallback' in order to pass state into verify callback function? 
  (req, accessToken, refreshToken, extraParams, profile, done) => done(null, profile)
);

/*
 * App Configuration
*/

// auth router attaches /login, /logout, and /callback routes to the baseURL
// middleware for passport and expressSession.
passport.use(strategy);

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((user, done) => done(null, user));

app.use(expressSession(session));
app.use(passport.initialize());
app.use(passport.session());

/**
 * Authentication check middleware
*/
const checkAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
    res.end();
  }
};

app.use('/users/:userUuid', checkAuthentication, (req, res, next) => {
  next();
});

app.use(apiRouter);

/** 
 * @description Serve static files from express backend.
*/

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(process.cwd(), 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'client', 'build', 'index.html'));
  });
}
