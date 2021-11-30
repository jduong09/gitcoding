const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const { generateRandomString, pkceChallengeFromVerifier } = require('./src/utils/pkce_helper');

const app = express();
const port = 5000;
let state = '';
let codeVerifier = '';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
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
  After user signs into Okta, okta will redirect to 'http://localhost:5000/login'
  In the Query of the redirect, will be a code and a state.
*/
// eslint-disable-next-line consistent-return
app.get('/callback', (req, res) => {
  console.log('REQUEST BODY: ', req.query);
  const { code, status } = req.query;

  if (req.query.error) {
    alert('Error returned from authorization server: ', req.query.error);
  }

  // if server returned an authorization code, attempt to exchange it for an access_token
  if (code) {
    res.end();
    return status;
  }
});

app.get('/auth/login', async (req, res) => {
  const config = {
    client_id: '0oa2w7lue0U6fnn3N5d7',
    redirect_uri: 'http://localhost:3000/',
    authorization_endpoint: 'https://dev-88956181.okta.com/oauth2/default/v1/authorize',
    token_endpoint: 'https://dev-88956181.okta.com/oauth2/default/v1/token',
    request_scopes: 'openid',
  };

  // Create and store a random "state" value
  state = generateRandomString();
  // Create and store a new PKCE code_verifier (the plaintext random secret)
  codeVerifier = generateRandomString();

  const codeChallenge = await pkceChallengeFromVerifier(codeVerifier);

  const url = `${config.authorization_endpoint}?response_type=code&client_id=${encodeURIComponent(config.client_id)}&state=${encodeURIComponent(state)}&scope=${encodeURIComponent(config.request_scopes)}&redirect_uri=${encodeURIComponent(config.redirect_uri)}&code_challenge=${encodeURIComponent(codeChallenge)}&code_challenge_method=S256`;

  res.redirect(url);
});
