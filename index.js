const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

app.get('/', async (req, res) => {
  await db.createUsers();
  res.send('Server is setup :)');
});

app.get('/api', (req, res) => {
  res.status(200).json({data: 'Stuff goes here'});
});

app.get('/users', async (req, res) => {
  console.log('FETCHING USERS');
  const { data, error } = await db.getAllUsers();
  console.log('RETURNED DATA: ', data, error);
  if(error) {
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
  if(error) {
    res.status(400).json({ error });
  } else {
    res.status(200).json({ data });
  }
});
