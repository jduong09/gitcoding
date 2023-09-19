const express = require('express');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const PGSession = require('connect-pg-simple')(expressSession);
const passport = require('passport');
const cookieParser = require('cookie-parser');
const Auth0Strategy = require('passport-auth0');
const path = require('path');
const dotenv = require('dotenv');
const apiRouter = require('./api');
const db = require('./db/db');
const users = require('./api/actions/users');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

db.migrate();

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

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
    sameSite: 'lax',
    httpOnly: false,
    maxAge: 24 * 12 * 60 * 100
  },
  resave: false,
  saveUninitialized: false,
};

// For using secure cookies in production, but allowing for testing in development,
// following is an example of enabling this setup based on NODE_ENV in express
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
  // Serve secure cookies, requires HTTPS
  session.cookie.secure = true;
}

app.use(expressSession(session));

/*
 * Passport Configuration
*/
const strategy = new Auth0Strategy({
    domain: process.env.ISSUER,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    passReqToCallback: true
  }, (req, accessToken, refreshToken, extraParams, profile, done) => done(null, profile));

/*
 * App Configuration
*/
// middleware for passport and expressSession.
passport.use(strategy);

passport.serializeUser((user, cb) => cb(null, { id: user.id, username: user.username, picture: user.picture }));

passport.deserializeUser((user, done) => done(null, user.id));

app.use(passport.initialize());
app.use(passport.session());

app.use(apiRouter);

/**
 * Authentication check middleware
*/
const checkAuthentication = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/');
    res.end();
  }
};

// on route /users/:userUuid, check if request is authenticated.
app.use('/users/:userUuid', checkAuthentication, (req, res, next) => {
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
