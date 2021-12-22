const db = require('../../db');

const getUsers = async () => {
  const { rows: data } = await db.execute('sql/users/get_all.sql');
  return data;
};

const createUser = async (name) => {
  console.log('\n\nATTEMPTING TO CREATE USER: ', name);
  const { rows: data } = await db.execute('sql/users/put.sql', {name});
  return data;
};

module.exports = {
  getUsers,
  createUser,
};