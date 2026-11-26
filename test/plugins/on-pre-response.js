const hapi = require('@hapi/hapi')
const config = require('../../server/config')
const boom = require('@hapi/boom')

const mocks = {
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn()
}

describe('on-pre-response plugin', () => {
  let server, fakeHandler

  beforeAll(async () => {
    server = hapi.server({
      port: config.port,
      routes: {
        validate: {
          options: {
            abortEarly: false
          }
        }
      }
    })
    await server.register(require('../../server/plugins/logging'))
    await server.register(require('../../server/plugins/on-pre-response'))
    await server.register({
      plugin: {
        name: 'example',
        register: (server) => server.route({
          method: 'GET',
          path: '/some/root',
          handler: (request, h) => {
            request.logger = {
              info: mocks.info,
              debug: mocks.debug,
              error: mocks.error
            }
            return fakeHandler(request, h)
          }
        })
      }
    })
  })

  afterEach(() => {
    for (const mock of Object.values(mocks)) {
      mock.mockClear()
    }
  })

  afterAll(async () => {
    await server.stop()
  })

  test('produces debug log for 200', async () => {
    const options = {
      method: 'GET',
      url: '/some/root'
    }
    fakeHandler = (request, h) => h.response('OK').code(200)

    await server.inject(options)

    expect(mocks.debug).toHaveBeenCalledTimes(1)
    expect(mocks.debug.mock.lastCall[0].res).toBeDefined()
    expect(mocks.debug.mock.lastCall[0].err).toBeUndefined()
  })

  test('produces debug log for 404', async () => {
    const options = {
      method: 'GET',
      url: '/some/root'
    }
    const err = new Error('not found')
    fakeHandler = (request, h) => boom.notFound('something not found', err)

    await server.inject(options)

    expect(mocks.debug).toHaveBeenCalledTimes(1)
    expect(mocks.debug.mock.lastCall[0].res).toBeDefined()
    expect(mocks.debug.mock.lastCall[0].err).toBeDefined()
  })

  test('produces error log for 403', async () => {
    const options = {
      method: 'GET',
      url: '/some/root'
    }
    const err = new Error('not happening')
    fakeHandler = (request, h) => boom.forbidden('computer says no', err)

    await server.inject(options)

    expect(mocks.error).toHaveBeenCalledTimes(1)
    expect(mocks.error.mock.lastCall[0].res).toBeDefined()
    expect(mocks.error.mock.lastCall[0].err).toBeDefined()
  })

  test('produces error log for 500', async () => {
    const options = {
      method: 'GET',
      url: '/some/root'
    }
    const err = new Error('Bang!')
    fakeHandler = (request, h) => boom.internal(err)

    await server.inject(options)

    expect(mocks.error).toHaveBeenCalledTimes(1)
    expect(mocks.error.mock.lastCall[0].res).toBeDefined()
    expect(mocks.error.mock.lastCall[0].err).toBeDefined()
  })
})
