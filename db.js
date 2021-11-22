const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on('connect', () => {
  console.log('Connected to the db!');
});

// TODO: We may want to only use this when there is an issue setting up the DB
// pool.on('remove', () => {
//   console.log('Client removed');
//   process.exit(0);
// });

/**
 * DB Query
 * @param {object} req
 * @param {object} res
 * @returns {object} object
 */
const query = async (text, params) => {
  return new Promise((resolve, reject) => {
    pool.query(text, params)
      .then((res) => { resolve(res); })
      .catch((err) => { reject(err); });
  });
};

/* *************************************************************
 * The following code is just for testing purposes and should
 * be refactored to suit our needs.
 ************************************************************* */


/**
 * @description Create users table
 * @param {object} req
 * @param {object} res
 * @returns {object} object
 */
const createUsers = async (req, res) => {
  console.log('CREATING USERS TABLE');
  const text = `
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL NOT NULL PRIMARY KEY,
      name TEXT NOT NULL,
      created TIMESTAMPTZ DEFAULT NOW() NOT NULL
    );
  `;

  try {
    const { rows } = await query(text);
  } catch(error) {
    console.log('ERROR CREATING USER TABLE: ', error);
  }
};

/**
 * Create A Reflection
 * @param {object} req 
 * @param {object} res
 * @returns {object} user row
 */
const insertUser = async (name) => {
  const text = `
    INSERT INTO users(name)
    VALUES($1)
    RETURNING *;
  `;
  const values = [name];

  try {
    const { rows } = await query(text, values);
    return { data: rows[0] };
  } catch(error) {
    return { error };
  }
};

/**
 * Get all users
 * @returns {object} users rows
 */
const getAllUsers = async () => {
  const findAllQuery = `SELECT * FROM users;`;
  try {
    const { rows, rowCount } = await query(findAllQuery);
    return { data: {rows, rowCount} };
  } catch(error) {
    return { error };
  }
};

module.exports = {
  query,
  createUsers,
  insertUser,
  getAllUsers,
};