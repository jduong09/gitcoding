const express = require('express');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const dotenv = require('dotenv');
const db = require('./db');
const authRouter = require('./auth');

dotenv.config();

const app = express();
const port = 5000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*
 * Session Configuration
*/
// ExpressSession takes a config object, session, that defines what options to enable in a session.
// shouldn't every secret be different for each login? 
const session = {
  secret: process.env.SESSION_SECRET,
  cookie: {
    sameSite: false,
  },
  resave: false,
  saveUninitialized: false
};

if (app.get('env') === 'production') {
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
  (accessToken, refreshToken, extraParams, profile, done) => {
    return done(null, profile);
  }
);

/*
 * App Configuration
*/

// auth router attaches /login, /logout, and /callback routes to the baseURL
// middleware for passport and expressSession.
passport.use(strategy);
app.use(expressSession(session));
app.use(passport.initialize());
app.use(passport.session());
// after passport.session, we would have the routes.
// Login, logout and callback sit on the /auth path

/*
app.use((req, res, next) => {
  req.session.state = authState;
  next();
});
*/

app.use('/auth', authRouter);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

/**
 * Authentication check middleware
*/

const checkAuthentication = (req, res, next) => {
  console.log('hi checking authentication!');
  if (req.isAuthenticated()) {
    console.log('you are good to go sir.')
    res.send({ isAuthenticated: true });
    next();
  } else {
    console.log('sir. this is VIP.');
    res.send({ isAuthenticated: false });
    res.end();
  }
};

app.use('/users/:userId', checkAuthentication, (req, res, next) => {
  next();
});

/** 
* Database Queries
*/

// Query: Create users table. Send that the database is setup!
app.get('/', async (req, res) => {
  await db.createUsers();
  res.send('Server is setup :)');
});

app.get('/api', (req, res) => {
  res.status(200).json({ data: 'Stuff goes here' });
});

// Query: Get all users in database.
app.get('/users', async (req, res) => {
  console.log('FETCHING USERS');
  const { data, error } = await db.getAllUsers();
  console.log('RETURNED DATA: ', data, error);
  if (error) {
    res.status(400).json({ error });
  } else {
    res.status(200).json({ data });
  }
});

// Query: Add a user to database.
app.post('/users', async (req, res) => {
  const { name } = req.body;
  console.log('ADDING NEW USER: ', name);
  const { data, error } = await db.insertUser(name);
  console.log('RETURNED DATA: ', data, error);
  if (error) {
    res.status(400).json({ error });
  } else {
    res.status(200).json({ data });
  }
});
