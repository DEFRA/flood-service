const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const lab = exports.lab = Lab.script()
const sinon = require('sinon')
const hapi = require('@hapi/hapi')
const routeLogger = require('../../server/lib/route-logger')

lab.experiment('route-logger plugin', () => {
  let server, logStub

  lab.beforeEach(() => {
    server = hapi.server()
    logStub = sinon.stub(console, 'log')
  })

  lab.afterEach(() => {
    logStub.restore()
  })

  lab.test('should log each route with an aligned method column on start', async () => {
    server.route({ method: 'GET', path: '/a', handler: () => 'a' })
    server.route({ method: 'POST', path: '/b', handler: () => 'b' })
    await server.register(routeLogger)

    await server.start()
    await server.stop()

    const lines = logStub.getCalls().map(call => call.args[0])
    Code.expect(lines[0]).to.equal('Routes:')
    Code.expect(lines).to.include('  GET     /a')
    Code.expect(lines).to.include('  POST    /b')
  })

  lab.test('should not log anything when there are no routes', async () => {
    await server.register(routeLogger)

    await server.start()
    await server.stop()

    Code.expect(logStub.called).to.be.false()
  })

  lab.test('should not log before the server starts', async () => {
    server.route({ method: 'GET', path: '/a', handler: () => 'a' })
    await server.register(routeLogger)

    Code.expect(logStub.called).to.be.false()
  })
})
