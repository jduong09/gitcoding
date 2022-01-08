const db = require('../../db/db');

const getUsers = async () => {
  const { rows: data } = await db.execute('server/sql/users/get_all.sql');
  return data;
};

const createUser = async ({name, identifier}) => {
  const { rows: data } = await db.execute('server/sql/users/put.sql', {name, identifier});
  return data;
};

const findUser = async (identifier) => {
  const { rows: data } = await db.execute('server/sql/users/findUser.sql', {identifier});
  return data;
}

module.exports = {
  getUsers,
  createUser,
  findUser
};