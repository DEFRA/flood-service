const hapi = require('@hapi/hapi')
const config = require('./config')

async function createServer () {
  // Create the hapi server
  const server = hapi.server({
    port: config.port,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    }
  })

  // Register the plugins
  await server.register(require('./plugins/router'))
  await server.register(require('blipp'))
  await server.register(require('./plugins/logging'))
  await server.register(require('./plugins/on-pre-response'))

  return server
}

module.exports = createServer
