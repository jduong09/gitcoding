const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const db = require('./db');
const { generateRandomString, pkceChallengeFromVerifier } = require('./src/utils/pkce_helper');

const app = express();
const port = 5000;
let state = '';
let codeVerifier = '';

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
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
  const config = {
    client_id: '0oa2w7lue0U6fnn3N5d7',
    redirect_uri: 'http://localhost:5000/token',
    authorization_endpoint: 'https://dev-88956181.okta.com/oauth2/default/v1/authorize',
    request_scopes: 'openid',
  };

  // Create and store a random "state" value
  state = generateRandomString();
  // Create and store a new PKCE code_verifier (the plaintext random secret)
  codeVerifier = generateRandomString();

  const codeChallenge = await pkceChallengeFromVerifier(codeVerifier);

  const myUrl = `${config.authorization_endpoint}?response_type=code&client_id=${encodeURIComponent(config.client_id)}&state=${encodeURIComponent(state)}&scope=${encodeURIComponent(config.request_scopes)}&redirect_uri=${encodeURIComponent(config.redirect_uri)}&code_challenge=${encodeURIComponent(codeChallenge)}&code_challenge_method=S256`;

  res.send({ url: myUrl });
  res.end();
});

app.get('/token', async (req, res) => {
  const tokenEndpoint = 'https://dev-88956181.okta.com/oauth2/default/v1/token';
  console.log(req.query);
  const q = req.query;
  await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from('0oa2w7lue0U6fnn3N5d7').toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    /*
    data: encodeURIComponent({
      code: q.code,
      redirect_uri: 'http://localhost:5000/token',
      code_verifier: codeVerifier,
    }),
    */
  }).then((data) => data.json()).then((json) => console.log(json));
  if (q.error) {
    res.send({ error: 'Oops, theres a problem' });
  }

  if (q.code) {
    if (state !== q.state) {
      res.send({ error: 'Invalid State' });
    } else {
      // Exchange the authorization code for an access token
    }
  }
  res.end();
});
