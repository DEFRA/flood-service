const queries = require('./queries')

function getQuery (name) {
  const query = queries[name]
  if (!query) {
    throw new Error(`query '${name}' not found`)
  }
  return query
}

module.exports = getQuery
