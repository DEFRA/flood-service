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

  lab.test('GET erroring works for /flood-area/alert/{code}', async () => {
    sandbox.stub(services, 'getAlertArea').throws(new Error())
    const options = {
      method: 'GET',
      url: '/flood-area/alert/061WAF07Cole'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get alert area')
  })

  lab.test('GET erroring works for /flood-area/warning/{code}', async () => {
    sandbox.stub(services, 'getWarningArea').throws(new Error())
    const options = {
      method: 'GET',
      url: '/flood-area/warning/034FWFDECHURCHW'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get warning area')
  })

  lab.test('GET erroring works for /floods', async () => {
    sandbox.stub(services, 'getFloods').throws(new Error())
    const options = {
      method: 'GET',
      url: '/floods'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get floods')
  })

  lab.test('GET erroring works for /floods-within/{x1}/{y1}/{x2}/{y2} ', async () => {
    sandbox.stub(services, 'getFloodsWithin').throws(new Error())
    const options = {
      method: 'GET',
      url: '/floods-within/-2.5353000164031982/53.420841217041016/-2.6395580768585205/53.36753845214844'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get floods search')
  })

  lab.test('GET erroring works for /impacts-within/{x1}/{y1}/{x2}/{y2} ', async () => {
    sandbox.stub(services, 'getImpactDataWithin').throws(new Error())
    const options = {
      method: 'GET',
      url: '/impacts-within/-2.5353000164031982/53.420841217041016/-2.6395580768585205/53.36753845214844'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get impact data')
  })

  lab.test('GET erroring works for /impacts/{id} ', async () => {
    sandbox.stub(services, 'getImpactData').throws(new Error())
    const options = {
      method: 'GET',
      url: '/impacts/7333'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get impact data')
  })

  lab.test('GET erroring works for /rainfall-station-telemetry/{stationId} ', async () => {
    sandbox.stub(services, 'getRainfallStationTelemetry').throws(new Error())
    const options = {
      method: 'GET',
      url: '/rainfall-station-telemetry/E12345'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get rainfall station telemetry')
  })

  lab.test('GET erroring works for /rainfall-station/{stationId} ', async () => {
    sandbox.stub(services, 'getRainfallStation').throws(new Error())
    const options = {
      method: 'GET',
      url: '/rainfall-station/E12345'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get rainfall by station data')
  })

  lab.test('GET erroring works for /river-name/{location} ', async () => {
    sandbox.stub(services, 'getRiversByName').throws(new Error())
    const options = {
      method: 'GET',
      url: '/river-name/Tyne'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get river names')
  })

  lab.test('GET erroring works for /river-by-riverid-or-wiskiname/{riverId}/{riverName} ', async () => {
    sandbox.stub(services, 'getRiverByIdOrWiskiName').throws(new Error())
    const options = {
      method: 'GET',
      url: '/river-by-riverid-or-wiskiname/river-tyne/River Tyne'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get stations by river_id or wiski_name')
  })

  lab.test('GET erroring works on /is-england/{x}/{y}', async () => {
    sandbox.stub(services, 'isEngland').throws(new Error())

    const options = {
      method: 'GET',
      url: '/is-england/-2.2370500564575195/53.4650993347168'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get isEngland')
  })

  lab.test('GET erroring works for /station/{rloiId}/{direction} ', async () => {
    sandbox.stub(services, 'getStation').throws(new Error())
    const options = {
      method: 'GET',
      url: '/station/7333/u'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get station data')
  })

  lab.test('GET erroring works for /station/{id}/{direction}/telemetry ', async () => {
    sandbox.stub(services, 'getStationTelemetry').throws(new Error())
    const options = {
      method: 'GET',
      url: '/station/7333/u/telemetry'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get telemetry data')
  })

  lab.test('GET erroring works for /station/{telemetryId}/forecast/data ', async () => {
    sandbox.stub(s3Service, 'ffoi').throws(new Error())
    const options = {
      method: 'GET',
      url: '/station/L2406/forecast/data'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get forecast data')
  })

  lab.test('GET erroring works for /station/{id}/forecast/thresholds ', async () => {
    sandbox.stub(services, 'getFFOIThresholds').throws(new Error())
    const options = {
      method: 'GET',
      url: '/station/7225/forecast/thresholds'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get ffoi threshold data')
  })

  lab.test('GET erroring works for /stations-within/{x1}/{y1}/{x2}/{y2} ', async () => {
    sandbox.stub(services, 'getStationsWithin').throws(new Error())
    const options = {
      method: 'GET',
      url: '/stations-within/0.7984259724617004/51.86424255371094/-1.0028589963912964/51.171478271484375'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get stations search')
  })

  lab.test('GET erroring works for /stations', async () => {
    sandbox.stub(services, 'getStations').throws(new Error())
    const options = {
      method: 'GET',
      url: '/stations'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get stations')
  })

  lab.test('GET erroring works for /target-area', async () => {
    sandbox.stub(services, 'getTargetArea').throws(new Error())
    const options = {
      method: 'GET',
      url: '/target-area/a1'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get target area')
  })

  lab.test('GET erroring works for /stations-health ', async () => {
    sandbox.stub(services, 'getStationsHealth').throws(new Error())
    const options = {
      method: 'GET',
      url: '/stations-health'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get station health')
  })

  lab.test('GET erroring works for /ffoi-health ', async () => {
    sandbox.stub(services, 'getFfoiHealth').throws(new Error())
    const options = {
      method: 'GET',
      url: '/ffoi-health'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get ffoi health')
  })

  lab.test('GET erroring works for /telemetry-health ', async () => {
    sandbox.stub(services, 'getTelemetryHealth').throws(new Error())
    const options = {
      method: 'GET',
      url: '/telemetry-health'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get telemetry health')
  })
  lab.test('GET erroring works for /river/{riverId} ', async () => {
    sandbox.stub(services, 'getRiverById').throws(new Error())
    const options = {
      method: 'GET',
      url: '/river/123'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get stations by river')
  })
  lab.test('GET erroring works for /river-station-by-station-id/{stationId}', async () => {
    sandbox.stub(services, 'getRiverStationByStationId').throws(new Error())
    const options = {
      method: 'GET',
      url: '/river-station-by-station-id/123'

    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get River Stations')
  })
  lab.test('GET erroring works for /stations-overview', async () => {
    sandbox.stub(services, 'getStationsOverview').throws(new Error())
    const options = {
      method: 'GET',
      url: '/stations-overview'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get stations overview data')
  })
  lab.test('GET erroring works for /stations-within-target-area/{taCode}', async () => {
    sandbox.stub(services, 'getStationsWithinTargetArea').throws(new Error())
    const options = {
      method: 'GET',
      url: '/stations-within-target-area/TA1'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get stations in target area search')
  })
  lab.test('GET erroring works for /warnings-alerts-within-station-buffer/{rloiId}', async () => {
    sandbox.stub(services, 'getWarningsAlertsWithinStationBuffer').throws(new Error())
    const options = {
      method: 'GET',
      url: '/warnings-alerts-within-station-buffer/1001'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get warnings and alerts within buffer search')
  })
  lab.test('GET /flood-guidance-statement error', async () => {
    const options = {
      method: 'GET',
      url: '/flood-guidance-statement'
    }

    sandbox.stub(s3Service, 'floodGuidanceStatement').throws(new Error())

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
  })
  lab.test('GET /flood-guidance-statement error', async () => {
    const options = {
      method: 'GET',
      url: '/stations-by-radius/-1.17316039381184/52.3951465511329'
    }

    sandbox.stub(services, 'getStationsByRadius').throws(new Error())

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get stations search')
  })
  lab.test('GET /river-name error', async () => {
    const options = {
      method: 'GET',
      url: '/river-name/merseysdvsdvsdv'
    }

    sandbox.stub(services, 'getRiversByName').throws(new Error())

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get river names')
  })
})
