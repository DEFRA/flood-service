const { Pool } = require('pg')
const { connectionString } = require('../config')
const pool = new Pool({ connectionString: connectionString })
module.exports = {
  query: pool.query.bind(pool)
}
