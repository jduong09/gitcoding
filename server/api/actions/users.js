const db = require('../../db/db');

const getUsers = async () => {
  const { rows: data } = await db.execute('server/sql/users/get_all.sql');
  return data;
};

const createUser = async ({name, identifier}) => {
  const { rows: data } = await db.execute('server/sql/users/put.sql', {name, identifier});
  return data.length ? data[0] : null;
};

const getUserByIdentifier = async (identifier) => {
  const { rows: data } = await db.execute('server/sql/users/getByIdentifier.sql', {identifier});
  return data.length ? data[0] : null;
}

module.exports = {
  getUsers,
  createUser,
  getUserByIdentifier
};