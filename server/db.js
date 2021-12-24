const { Pool } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');

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
const query = async (text, params) => new Promise((resolve, reject) => {
    pool.query(text, params)
      .then((res) => { resolve(res); })
      .catch((err) => { reject(err); });
  });

/* *************************************************************
 * The following code is just for testing purposes and should
 * be refactored to suit our needs.
 ************************************************************* */


/**
 * @description Create users table
 * TODO: Eventually get rid of this code when we store migrations programatically
 * @param {object} req
 * @param {object} res
 * @returns {object} object
 */
const createUsers = async () => {
  console.log('CREATING USERS TABLE');
  const text = `
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL NOT NULL PRIMARY KEY,
      name TEXT NOT NULL,
      created TIMESTAMPTZ DEFAULT NOW() NOT NULL
    );
  `;

  try {
    await query(text);
  } catch(error) {
    console.log('ERROR CREATING USER TABLE: ', error);
  }
};

/**
 * @description Run a SQL query given a filepath
 * @param {string} path
 * @param {object} [params]
 * @param {object} [options]
 * @param {number} [options.timeout]
 * @param {string} [options.rowMode]
 * @param {object} [options.client]
 * @param {boolean} [options.reader]
 * @param {string[]} [options.consistencyKeys] - Keys for read-after-write consistency
 */
async function execute(path, params = {}) {
  const queryVariables = [];
  const queryParam = (qv) => {
    const variable = qv.slice(2, -1);
    const i = queryVariables.indexOf(variable);
    if(i >= 0) {
      return `$${i + 1}`;
    }
    queryVariables.push(variable);
    return `$${queryVariables.length}`;
  };
  let sql = fs.readFileSync(path).toString();
  sql = sql.replace(/\$\{[^{}]+\}/g, queryParam);
  const values = queryVariables ? queryVariables.map(p => params[p]) : [];
  return query(sql, values);
}

module.exports = {
  query,
  createUsers,
  execute,
};