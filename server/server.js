const express = require('express');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const PGSession = require('connect-pg-simple')(expressSession);
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const path = require("path");
const dotenv = require('dotenv');
const apiRouter = require('./api');
const pgPool = require('./db/db');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});

/*
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*
 * Session Configuration
*/

const session = {
  store: new PGSession({
    pool: pgPool,
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
  // trust first proxy, workaround for heroku deployment to set secure cookie.
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

passport.deserializeUser((user, done) => {
  console.log('Deserialized User: ', user);
  return done(null, user);
});

app.use(expressSession(session));
app.use(passport.initialize());
app.use(passport.session());
app.use(apiRouter);

/**
 * Authentication check middleware
*/
const checkAuthentication = (req, res, next) => {
  console.log('Check session in checkAuth function: ', req.session);
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true });
    res.end();
    console.log('You\'re good to go sir');
  } else {
    res.json({ isAuthenticated: false });
    console.log('Step back, sir.');
    res.end();
  }
};

app.use('/users/:userId', checkAuthentication, (req, res, next) => {
  next();
});

/** 
 * @description Serve static files from express backend.
*/

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(process.cwd(), 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'client', 'build', 'index.html'));
  });
}
 