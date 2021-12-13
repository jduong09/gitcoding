const express = require('express');
const path = require('path');
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
const session = {
  secret: process.env.SESSION_SECRET,
  cookie: {
    sameSite: false
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
    callbackURL: process.env.CALLBACK_URL
  },
  (accessToken, refreshToken, extraParams, profile, done) => done(null, profile)
);

/*
 * App Configuration
*/
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession(session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

// Login, logout and callback sit on the /auth path
app.use('/auth', authRouter);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get('/', async (req, res) => {
  await db.createUsers();
  res.send('Server is setup :)');
});


app.get('/api', (req, res) => {
  res.status(200).json({ data: 'Stuff goes here' });
});


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

/*
app.get('/auth/login', async (req, res) => {
  randomString = generateRandomString();

  const params = [
    ['response_type', 'code'],
    ['client_id', process.env.CLIENT_ID],
    ['state', randomString],
    ['redirect_uri', 'http://localhost:5000/callback'],
  ];
  const paramString = params
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&');

  res.send({ url: `${process.env.ISSUER}/authorize?${paramString}`});
  res.end();
});

// after user authorizes app, Auth0 will redirect to callback URI: 'http://localhost:5000/callback'
// it will have two keys: state and code
// Server needs to make sure the state matches up from the state that is stored locally.
app.get('/callback', async (req, res) => {
  // should contain an object, with state and code as keys
  const callbackQuery = req.query;

  console.log(callbackQuery);
  res.end();
});
*/