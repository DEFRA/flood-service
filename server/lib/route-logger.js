// Longest HTTP method name we expect to print (OPTIONS), used to align columns
const METHOD_COLUMN_WIDTH = 7

const plugin = {
  name: 'route-logger',
  version: '1.0.0',
  register: async function (server) {
    server.events.on('start', () => {
      const routes = server.table()

      if (routes.length > 0) {
        console.log('Routes:')
        routes.forEach(route => {
          console.log(`  ${route.method.toUpperCase().padEnd(METHOD_COLUMN_WIDTH)} ${route.path}`)
        })
      }
    })
  }
}

module.exports = plugin
