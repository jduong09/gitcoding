const express = require('express');
const bodyParser = require('body-parser');
const { auth } = require('express-openid-connect');
const dotenv = require('dotenv');
const db = require('./db');
const { generateRandomString } = require('./src/utils/pkce_helper');

dotenv.config();

const app = express();
const port = 5000;
let randomString = '';

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.CLIENT_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
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

app.get('/auth/login', async (req, res) => {
  randomString = generateRandomString();

  const params = [
    ['response_type', 'code'],
    ['client_id', process.env.CLIENT_ID],
    ['state', randomString],
    ['redirect_uri', 'http://localhost:3000/callback'],
  ];
  const paramString = params
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&');

  res.send({ url: `${process.env.ISSUER}/authorize?${paramString}`});
  res.end();
});