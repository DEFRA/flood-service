const createServer = require('../../server')
const services = require('../../server/services/index.js')
const s3Service = require('../../server/services/s3')

describe('Sad Route tests', () => {
  let server

  // Create server once before the tests.
  beforeAll(async () => {
    server = await createServer()
  })

  // Stop server after the tests.
  afterAll(async () => {
    await server.stop()
  })

  test('GET erroring works for /flood-area/alert/{code}', async () => {
    jest.spyOn(services, 'getAlertArea').mockRejectedValue(new Error())
    const options = {
      method: 'GET',
      url: '/flood-area/alert/061WAF07Cole'

    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Failed to get alert area')
  })

  test('GET erroring works for /flood-area/warning/{code}', async () => {
    jest.spyOn(services, 'getWarningArea').mockRejectedValue(new Error())
    const options = {
      method: 'GET',
      url: '/flood-area/warning/034FWFDECHURCHW'

    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Failed to get warning area')
  })

  test('GET erroring works for /floods', async () => {
    jest.spyOn(services, 'getFloods').mockRejectedValue(new Error())
    const options = {
      method: 'GET',
      url: '/floods'

    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Failed to get floods')
  })

  test('GET erroring works for /floods-within/{x1}/{y1}/{x2}/{y2} ', async () => {
    jest.spyOn(services, 'getFloodsWithin').mockRejectedValue(new Error())
    const options = {
      method: 'GET',
      url: '/floods-within/-2.5353000164031982/53.420841217041016/-2.6395580768585205/53.36753845214844'

    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Failed to get floods search')
  })

  test('GET erroring works for /impacts-within/{x1}/{y1}/{x2}/{y2} ', async () => {
    jest.spyOn(services, 'getImpactDataWithin').mockRejectedValue(new Error())
    const options = {
      method: 'GET',
      url: '/impacts-within/-2.5353000164031982/53.420841217041016/-2.6395580768585205/53.36753845214844'

    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Failed to get impact data')
  })

  test('GET erroring works for /impacts/{id} ', async () => {
    jest.spyOn(services, 'getImpactData').mockRejectedValue(new Error())
    const options = {
      method: 'GET',
      url: '/impacts/7333'

    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Failed to get impact data')
  })

  test('GET erroring works for /rainfall-station-telemetry/{stationId} ', async () => {
    jest.spyOn(services, 'getRainfallStationTelemetry').mockRejectedValue(new Error())
    const options = {
      method: 'GET',
      url: '/rainfall-station-telemetry/E12345'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Failed to get rainfall station telemetry')
  })

  test('GET erroring works for /rainfall-station/{stationId} ', async () => {
    jest.spyOn(services, 'getRainfallStation').mockRejectedValue(new Error())
    const options = {
      method: 'GET',
      url: '/rainfall-station/E12345'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Failed to get rainfall by station data')
  })

  test('GET erroring works for /river-name/{location} ', async () => {
    jest.spyOn(services, 'getRiversByName').mockRejectedValue(new Error())
    const options = {
      method: 'GET',
      url: '/river-name/Tyne'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Failed to get river names')
  })

  test('GET erroring works on /is-england/{x}/{y}', async () => {
    jest.spyOn(services, 'isEngland').mockRejectedValue(new Error())

    const options = {
      method: 'GET',
      url: '/is-england/-2.2370500564575195/53.4650993347168'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Failed to get isEngland')
  })

  test('GET erroring works for /station/{rloiId}/{direction} ', async () => {
    jest.spyOn(services, 'getStation').mockRejectedValue(new Error())
    const options = {
      method: 'GET',
      url: '/station/7333/u'

    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Failed to get station data')
  })

  test('GET erroring works for /station/{id}/{direction}/telemetry ', async () => {
    jest.spyOn(services, 'getStationTelemetry').mockRejectedValue(new Error())
    const options = {
      method: 'GET',
      url: '/station/7333/u/telemetry'

    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Failed to get telemetry data')
  })

  test('GET erroring works for /station/{telemetryId}/forecast/data ', async () => {
    jest.spyOn(s3Service, 'ffoi').mockRejectedValue(new Error())
    const options = {
      method: 'GET',
      url: '/station/L2406/forecast/data'

    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Failed to get forecast data')
  })

  test('GET erroring works for /stations-within/{x1}/{y1}/{x2}/{y2} ', async () => {
    jest.spyOn(services, 'getStationsWithin').mockRejectedValue(new Error())
    const options = {
      method: 'GET',
      url: '/stations-within/0.7984259724617004/51.86424255371094/-1.0028589963912964/51.171478271484375'

    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Failed to get stations search')
  })

  test('GET erroring works for /stations', async () => {
    jest.spyOn(services, 'getStations').mockRejectedValue(new Error())
    const options = {
      method: 'GET',
      url: '/stations'

    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Failed to get stations')
  })

  test('GET erroring works for /target-area', async () => {
    jest.spyOn(services, 'getTargetArea').mockRejectedValue(new Error())
    const options = {
      method: 'GET',
      url: '/target-area/a1'

    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Failed to get target area')
  })

  test('GET erroring works for /stations-health ', async () => {
    jest.spyOn(services, 'getStationsHealth').mockRejectedValue(new Error())
    const options = {
      method: 'GET',
      url: '/stations-health'

    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Failed to get station health')
  })

  test('GET erroring works for /ffoi-health ', async () => {
    jest.spyOn(services, 'getFfoiHealth').mockRejectedValue(new Error())
    const options = {
      method: 'GET',
      url: '/ffoi-health'

    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Failed to get ffoi health')
  })

  test('GET erroring works for /telemetry-health ', async () => {
    jest.spyOn(services, 'getTelemetryHealth').mockRejectedValue(new Error())
    const options = {
      method: 'GET',
      url: '/telemetry-health'

    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Failed to get telemetry health')
  })
  test('GET erroring works for /river/{riverId} ', async () => {
    jest.spyOn(services, 'getRiverStationsByRiverId').mockRejectedValue(new Error())
    const options = {
      method: 'GET',
      url: '/river/123'

    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Failed to get stations by river')
  })
  test('GET erroring works for /river-station-by-station-id/{stationId}{direction}', async () => {
    jest.spyOn(services, 'getRiverStationByStationId').mockRejectedValue(new Error())
    const options = {
      method: 'GET',
      url: '/river-station-by-station-id/123/u'

    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Failed to get River Stations')
  })
  test('GET erroring works for /stations-overview', async () => {
    jest.spyOn(services, 'getStationsOverview').mockRejectedValue(new Error())
    const options = {
      method: 'GET',
      url: '/stations-overview'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Failed to get stations overview data')
  })
  test('GET erroring works for /stations-within-target-area/{taCode}', async () => {
    jest.spyOn(services, 'getStationsWithinTargetArea').mockRejectedValue(new Error())
    const options = {
      method: 'GET',
      url: '/stations-within-target-area/TA1'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Failed to get stations in target area search')
  })
  test('GET erroring works for /warnings-alerts-within-station-buffer/{rloiId}', async () => {
    jest.spyOn(services, 'getWarningsAlertsWithinStationBuffer').mockRejectedValue(new Error())
    const options = {
      method: 'GET',
      url: '/warnings-alerts-within-station-buffer/1001'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Failed to get warnings and alerts within buffer search')
  })
  test('GET /flood-guidance-statement error', async () => {
    const options = {
      method: 'GET',
      url: '/flood-guidance-statement'
    }

    jest.spyOn(s3Service, 'floodGuidanceStatement').mockRejectedValue(new Error())

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
  })
  test('GET /flood-guidance-statement error', async () => {
    const options = {
      method: 'GET',
      url: '/stations-by-radius/-1.17316039381184/52.3951465511329'
    }

    jest.spyOn(services, 'getStationsByRadius').mockRejectedValue(new Error())

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Failed to get stations search')
  })
  test('GET /river-name error', async () => {
    const options = {
      method: 'GET',
      url: '/river-name/merseysdvsdvsdv'
    }

    jest.spyOn(services, 'getRiversByName').mockRejectedValue(new Error())

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Failed to get river names')
  })

  test('GET erroring works for /target-area/{fwisCode}/imtd-thresholds', async () => {
    const options = {
      method: 'GET',
      url: '/target-area/034FWFTRWLLNGTA/imtd-thresholds'
    }

    jest.spyOn(services, 'getTargetAreaThresholds').mockRejectedValue(new Error())

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Failed to get target area thresholds')
  })
  test('GET /forecast-station error', async () => {
    const options = {
      method: 'GET',
      url: '/forecast-station/8208/u'
    }

    jest.spyOn(services, 'getForecastFlag').mockRejectedValue(new Error())

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Failed to get station data')
  })
  test('GET /error returns a 400 test error', async () => {
    const response = await server.inject({ method: 'GET', url: '/error' })
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Test Error')
  })
  test('GET /station/{id}/{direction}/imtd-thresholds returns an error payload when the service fails', async () => {
    jest.spyOn(services, 'getStationImtdThresholds').mockRejectedValue(new Error('boom'))

    const response = await server.inject({ method: 'GET', url: '/station/7225/u/imtd-thresholds' })
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Failed to get station threshold data')
  })
  test('GET /forecast-station fails validation', async () => {
    const options = {
      method: 'GET',
      url: '/forecast-station/hndghndghn/u'
    }

    jest.spyOn(services, 'getForecastFlag').mockRejectedValue(new Error())

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Invalid request params input')
  })
})
