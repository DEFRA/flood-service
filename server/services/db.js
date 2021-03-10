const { Pool } = require('pg')
const { connectionString } = require('../config')
const getQuery = require('./getQuery')
const pool = new Pool({ connectionString: connectionString })

async function query (queryName, ...args) {
  return pool.query(getQuery(queryName), ...args)
}

module.exports = {
  query
}
