const express = require('express');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const path = require("path");
const dotenv = require('dotenv');
const apiRouter = require('./api');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/*
 * Session Configuration
*/

const session = {
  secret: process.env.SESSION_SECRET,
  cookie: {
    sameSite: false,
  },
  resave: false,
  saveUninitialized: true
};

if (process.env.NODE_ENV === 'production') {
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
    state: true,
  },
  // verify callback, use 'passReqToCallback' in order to pass state into verify callback function? 
  (accessToken, refreshToken, extraParams, profile, done) => done(null, profile)
);

/*
 * App Configuration
*/

// auth router attaches /login, /logout, and /callback routes to the baseURL
// middleware for passport and expressSession.
passport.use(strategy);

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((user, done) => {
  console.log('User: ', user);
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
  if (req.isAuthenticated()) {
    res.send({ isAuthenticated: true });
    next();
  } else {
    res.send({ isAuthenticated: false });
    res.end();
  }
};

app.use('/users/:userId', checkAuthentication, (req, res, next) => {
  next();
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(process.cwd(), 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'client', 'build', 'index.html'));
  });
}