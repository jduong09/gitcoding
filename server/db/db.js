/* eslint-disable no-await-in-loop */
const { Pool } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');
const { getOutStandingMigrations } = require('../api/actions/migrations');

dotenv.config();

const poolConfigs = { connectionString: process.env.DATABASE_URL };

if (process.env.NODE_ENV === 'production') {
  poolConfigs.ssl = { 
    rejectUnauthorized: false,
    sslmode: 'require'
  };
}

const pgPool = new Pool(poolConfigs);

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
    pgPool.query(text, params)
      .then((res) => { resolve(res); })
      .catch((err) => { reject(err); });
  });

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
};

/**
 * @description Select all migrations, filter out executed migrations, and executes leftover migrations.
 * Runs a transaction, which will run all leftover migrations, or fail completely.
 */

const migrate = async () => {
  let existingMigrations = [];
  try {
    const result = await execute('server/sql/migrationQueries/get_all.sql');
    existingMigrations = result.rows.map((r) => r.file_name);
  } catch {
    console.log('First migration');
  }

  // Get outstanding migrations
  const outstandingMigrations = await getOutStandingMigrations(existingMigrations);

  await pgPool.connect(async (error, client, release) => {
    if (error) {
      return console.log('Error connected to db: ', error);
    };

    try {
      // Start transaction
      await client.query('BEGIN');
      // eslint-disable-next-line no-restricted-syntax
      for (const migration of outstandingMigrations) {
        await execute(`server/sql/migrations/${migration.file}`);
        await execute('server/sql/migrationQueries/put.sql', { file_name: migration.file });
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
    } finally {
      release((err) => {
        console.log('Client has disconnected');
        if (err) {
          console.log('ERR: ', err.stack);
        }
      });
    }
  });
};

module.exports = {
  query,
  execute,
  pgPool
};