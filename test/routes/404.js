const createServer = require('../../server')
const services = require('../../server/services/index.js')

describe('404 Route tests', () => {
  let server

  // Create server once before the tests.
  beforeAll(async () => {
    server = await createServer()
  })

  // Stop server after the tests.
  afterAll(async () => {
    await server.stop()
  })

  test('1 - null return works for /flood-area/alert/{code}', async () => {
    const options = {
      method: 'GET',
      url: '/flood-area/alert/061WAF07Cole'

    }

    jest.spyOn(services, 'getAlertArea').mockReturnValue(undefined)

    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
    expect(response.payload).toContain('Alert area 061WAF07Cole')
  })

  test('2 - null return works for /flood-area/warning/{code}', async () => {
    const options = {
      method: 'GET',
      url: '/flood-area/warning/034FWFDECHURCHW'

    }

    jest.spyOn(services, 'getWarningArea').mockReturnValue(undefined)

    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
    expect(response.payload).toContain('Warning area 034FWFDECHURCHW')
  })

  test('3 - null return works for /station/{rloiId}/{direction} ', async () => {
    const options = {
      method: 'GET',
      url: '/station/7333/u'

    }

    jest.spyOn(services, 'getStation').mockReturnValue(undefined)

    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
    expect(response.payload).toContain('Station 7333 (u)')
  })

  test('4 - null return works for /rainfall-station/{stationId}', async () => {
    const options = {
      method: 'GET',
      url: '/rainfall-station/123456'

    }

    jest.spyOn(services, 'getRainfallStation').mockReturnValue(undefined)

    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
    expect(response.payload).toContain('{"statusCode":404,"error":"Not Found","message":"No rainfall station data found"}')
  })
})
