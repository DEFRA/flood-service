const { Pool } = require('pg')
const config = require('../config')
const pool = new Pool({
  connectionString: config.connectionString })
module.exports = {
  query: pool.query.bind(pool)
}
