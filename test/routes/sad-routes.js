const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const lab = exports.lab = Lab.script()
const createServer = require('../../server')
const sinon = require('sinon')
const services = require('../../server/services/index.js')
const s3Service = require('../../server/services/s3')

lab.experiment('Sad Route tests', () => {
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

  lab.test('1 - GET erroring works for /flood-area/alert/{code}', async () => {
    sandbox.stub(services, 'getAlertArea').throws(new Error())
    const options = {
      method: 'GET',
      url: '/flood-area/alert/061WAF07Cole'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get alert area')
  })

  lab.test('2 - GET erroring works for /flood-area/warning/{code}', async () => {
    sandbox.stub(services, 'getWarningArea').throws(new Error())
    const options = {
      method: 'GET',
      url: '/flood-area/warning/034FWFDECHURCHW'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get warning area')
  })

  lab.test('3 - GET erroring works for /floods', async () => {
    sandbox.stub(services, 'getFloods').throws(new Error())
    const options = {
      method: 'GET',
      url: '/floods'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get floods')
  })

  lab.test('4 - GET erroring works for /floods-within/{x1}/{y1}/{x2}/{y2} ', async () => {
    sandbox.stub(services, 'getFloodsWithin').throws(new Error())
    const options = {
      method: 'GET',
      url: '/floods-within/-2.5353000164031982/53.420841217041016/-2.6395580768585205/53.36753845214844'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get floods search')
  })

  lab.test('5 - GET erroring works for /impacts-within/{x1}/{y1}/{x2}/{y2} ', async () => {
    sandbox.stub(services, 'getImpactDataWithin').throws(new Error())
    const options = {
      method: 'GET',
      url: '/impacts-within/-2.5353000164031982/53.420841217041016/-2.6395580768585205/53.36753845214844'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get impact data')
  })

  lab.test('6 - GET erroring works for /impacts/{id} ', async () => {
    sandbox.stub(services, 'getImpactData').throws(new Error())
    const options = {
      method: 'GET',
      url: '/impacts/7333'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get impact data')
  })

  lab.test('7 - GET erroring works on /is-england/{x}/{y}', async () => {
    sandbox.stub(services, 'isEngland').throws(new Error())

    const options = {
      method: 'GET',
      url: '/is-england/-2.2370500564575195/53.4650993347168'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get isEngland')
  })

  lab.test('8 - GET erroring works for /station/{rloiId}/{direction} ', async () => {
    sandbox.stub(services, 'getStation').throws(new Error())
    const options = {
      method: 'GET',
      url: '/station/7333/u'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get station data')
  })

  lab.test('9 - GET erroring works for /station/{id}/{direction}/telemetry ', async () => {
    sandbox.stub(services, 'getStationTelemetry').throws(new Error())
    const options = {
      method: 'GET',
      url: '/station/7333/u/telemetry'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get telemetry data')
  })

  lab.test('10 - GET erroring works for /station/{telemetryId}/forecast/data ', async () => {
    sandbox.stub(s3Service, 'ffoi').throws(new Error())
    const options = {
      method: 'GET',
      url: '/station/L2406/forecast/data'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get forecast data')
  })

  lab.test('11 - GET erroring works for /station/{id}/forecast/thresholds ', async () => {
    sandbox.stub(services, 'getFFOIThresholds').throws(new Error())
    const options = {
      method: 'GET',
      url: '/station/7225/forecast/thresholds'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get ffoi threshold data')
  })

  lab.test('13 - GET erroring works for /stations-within-radius/{lng}/{lat}/{radiusM} ', async () => {
    sandbox.stub(services, 'getStationsByRadius').throws(new Error())
    const options = {
      method: 'GET',
      url: '/stations-within-radius/-1.77555/51.7218/10000'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get stations by radius')
  })

  lab.test('14 - GET erroring works for /stations-within/{x1}/{y1}/{x2}/{y2} ', async () => {
    sandbox.stub(services, 'getStationsWithin').throws(new Error())
    const options = {
      method: 'GET',
      url: '/stations-within/0.7984259724617004/51.86424255371094/-1.0028589963912964/51.171478271484375'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get stations search')
  })
})
