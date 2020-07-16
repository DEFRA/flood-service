const { Pool } = require('pg')
const { connectionString } = require('../config')
const getQuery = require('./getQuery')
const pool = new Pool({ connectionString: connectionString })

async function query (queryName, ...args) {
  const query = getQuery(queryName)
  return pool.query(query, ...args)
}

module.exports = {
  query
}
