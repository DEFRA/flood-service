const createServer = require('./server')
const pino = require('./server/lib/logging/pino')

module.exports = createServer()
  .then(server => {
    server.listener.requestTimeout = 0
    server.listener.headersTimeout = 0
    return server.start()
  })
  .catch(err => {
    pino.fatal({
      err
    })
    pino.flush(() => {
      process.exit(1)
    })
  })
