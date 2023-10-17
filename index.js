const createServer = require('./server')
const pino = require('./server/lib/pino')

module.exports = createServer()
  .then(async server => {
    server.listener.requestTimeout = 0
    server.listener.headersTimeout = 0
    return server.start()
  })
  .catch(err => {
    pino.fatal({
      situation: 'UNEXPECTED_FATAL_ERROR',
      stack: err.stack
    })
    process.exit(1)
  })
