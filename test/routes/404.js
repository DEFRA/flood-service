const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const lab = exports.lab = Lab.script()
const createServer = require('../../server')
const sinon = require('sinon')
const services = require('../../server/services/index.js')

lab.experiment('404 Route tests', () => {
  let server
  let sandbox

  // Create server before each test
  lab.before(async () => {
    sandbox = sinon.createSandbox()
    server = await createServer()
  })

  lab.afterEach(async () => {
    sandbox.restore()
  })
  // Stop server after the tests.
  lab.after(async () => {
    await server.stop()
  })

  lab.test('1 - null return works for /flood-area/alert/{code}', async () => {
    const options = {
      method: 'GET',
      url: '/flood-area/alert/061WAF07Cole'

    }

    sandbox.stub(services, 'getAlertArea')

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(404)
    Code.expect(response.payload).to.include('Alert area 061WAF07Cole')
  })

  lab.test('2 - null return works for /flood-area/warning/{code}', async () => {
    const options = {
      method: 'GET',
      url: '/flood-area/warning/034FWFDECHURCHW'

    }

    sandbox.stub(services, 'getWarningArea')

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(404)
    Code.expect(response.payload).to.include('Warning area 034FWFDECHURCHW')
  })

  lab.test('3 - null return works for /station/{rloiId}/{direction} ', async () => {
    const options = {
      method: 'GET',
      url: '/station/7333/u'

    }

    sandbox.stub(services, 'getStation')

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(404)
    Code.expect(response.payload).to.include('Station 7333 (u)')
  })

  lab.test('4 - null return works for /rainfall-station/{stationId}', async () => {
    const options = {
      method: 'GET',
      url: '/rainfall-station/123456'

    }

    sandbox.stub(services, 'getRainfallStation')

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(404)
    Code.expect(response.payload).to.include('{"statusCode":404,"error":"Not Found","message":"No rainfall station data found"}')
  })
})
