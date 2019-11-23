const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()
const Code = require('@hapi/code')
let connectionString

lab.experiment('Config test', () => {
  lab.beforeEach(() => {
    connectionString = process.env.FLOOD_SERVICE_CONNECTION_STRING
    delete process.env.FLOOD_SERVICE_CONNECTION_STRING
    delete require.cache[require.resolve('../server/config')]
  })

  lab.afterEach(() => {
    process.env.FLOOD_SERVICE_CONNECTION_STRING = connectionString
    delete require.cache[require.resolve('../server/config')]
  })

  lab.test('Check bad config fails', () => {
    Code.expect(() => { require('../server/config') }).to.throw()
  })
})
