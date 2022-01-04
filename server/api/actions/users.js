const db = require('../../db/db');

const getUsers = async () => {
  const { rows: data } = await db.execute('server/sql/users/get_all.sql');
  return data;
};

const createUser = async (name) => {
  const { rows: data } = await db.execute('server/sql/users/put.sql', {name});
  return data;
};

module.exports = {
  getUsers,
  createUser,
};