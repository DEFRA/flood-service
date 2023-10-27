const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const lab = exports.lab = Lab.script()
const sinon = require('sinon')
const hapi = require('@hapi/hapi')
const config = require('../../server/config')
const boom = require('@hapi/boom')

const mocks = {
  debug: sinon.spy(),
  error: sinon.spy(),
  info: sinon.spy()
}

lab.experiment('on-pre-response plugin', () => {
  let server, fakeHandler

  // Create server before each test
  lab.before(async () => {
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

  lab.afterEach(async () => {
    for (const mock of Object.values(mocks)) {
      mock.resetHistory()
    }
  })
  // Stop server after the tests.
  lab.after(async () => {
    await server.stop()
  })

  lab.test('produces debug log for 200', async () => {
    const options = {
      method: 'GET',
      url: '/some/root'
    }
    fakeHandler = (request, h) => h.response('OK').code(200)

    await server.inject(options)

    Code.expect(mocks.debug.callCount).to.equal(1)
    Code.expect(mocks.debug.lastCall.args[0].res).not.to.equal(undefined)
    Code.expect(mocks.debug.lastCall.args[0].err).to.equal(undefined)
  })

  lab.test('produces debug log for 404', async () => {
    const options = {
      method: 'GET',
      url: '/some/root'
    }
    const err = new Error('not found')
    fakeHandler = (request, h) => boom.notFound('something not found', err)

    await server.inject(options)

    Code.expect(mocks.debug.callCount).to.equal(1)
    Code.expect(mocks.debug.lastCall.args[0].res).not.to.equal(undefined)
    Code.expect(mocks.debug.lastCall.args[0].err).not.to.equal(undefined)
  })

  lab.test('produces error log for 403', async () => {
    const options = {
      method: 'GET',
      url: '/some/root'
    }
    const err = new Error('not happening')
    fakeHandler = (request, h) => boom.forbidden('computer says no', err)

    await server.inject(options)

    Code.expect(mocks.error.callCount).to.equal(1)
    Code.expect(mocks.error.lastCall.args[0].res).not.to.equal(undefined)
    Code.expect(mocks.error.lastCall.args[0].err).not.to.equal(undefined)
  })

  lab.test('produces error log for 500', async () => {
    const options = {
      method: 'GET',
      url: '/some/root'
    }
    const err = new Error('Bang!')
    fakeHandler = (request, h) => boom.internal(err)

    await server.inject(options)

    Code.expect(mocks.error.callCount).to.equal(1)
    Code.expect(mocks.error.lastCall.args[0].res).not.to.equal(undefined)
    Code.expect(mocks.error.lastCall.args[0].err).not.to.equal(undefined)
  })
})
