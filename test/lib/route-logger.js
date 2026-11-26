const hapi = require('@hapi/hapi')
const routeLogger = require('../../server/lib/route-logger')

describe('route-logger plugin', () => {
  let server, logSpy

  beforeEach(() => {
    server = hapi.server()
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  test('should log each route with an aligned method column on start', async () => {
    server.route({ method: 'GET', path: '/a', handler: () => 'a' })
    server.route({ method: 'POST', path: '/b', handler: () => 'b' })
    await server.register(routeLogger)

    await server.start()
    await server.stop()

    const lines = logSpy.mock.calls.map(args => args[0])
    expect(lines[0]).toBe('Routes:')
    expect(lines).toContain('  GET     /a')
    expect(lines).toContain('  POST    /b')
  })

  test('should not log anything when there are no routes', async () => {
    await server.register(routeLogger)

    await server.start()
    await server.stop()

    expect(logSpy).not.toHaveBeenCalled()
  })

  test('should not log before the server starts', async () => {
    server.route({ method: 'GET', path: '/a', handler: () => 'a' })
    await server.register(routeLogger)

    expect(logSpy).not.toHaveBeenCalled()
  })
})
