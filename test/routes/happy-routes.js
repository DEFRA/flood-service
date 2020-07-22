const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const lab = exports.lab = Lab.script()
const createServer = require('../../server')
const sinon = require('sinon')
const services = require('../../server/services/index.js')
const mock = require('../mock')
const s3Service = require('../../server/services/s3')

lab.experiment('Happy Route tests', () => {
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

  lab.test('GET / route works for /flood-area/alert/{code}', async () => {
    const options = {
      method: 'GET',
      url: '/flood-area/alert/061WAF07Cole'

    }

    const stub = mock.replace(services, 'getAlertArea', mock.makePromise(null, {
      id: 5512,
      area: 'Thames',
      code: '061WAF07Cole',
      name: 'River Cole and Dorcan Brook',
      description: 'River Cole and The Dorcan Brook for the East Swindon Area down to above Buscot Wick',
      localauthorityname: 'Oxfordshire, Swindon',
      quickdialnumber: '171235',
      riverorsea: 'River Cole',
      geom: '{}',
      centroid: '{\'type:\'Point\',\'coordinates:[-1.69232110253823,51.6047668691946]}'
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    stub.revert()
  })

  lab.test('GET / route works for /flood-area/warning/{code}', async () => {
    const options = {
      method: 'GET',
      url: '/flood-area/warning/034FWFDECHURCHW'

    }

    const stub = mock.replace(services, 'getWarningArea', mock.makePromise(null, {
      id: 22517,
      area: 'East Midlands',
      code: '034FWFDECHURCHW',
      name: 'River Derwent at Church Wilne and Wilne Lane',
      description: 'River Derwent at Church Wilne and Wilne Lane including Saint Chad\'s Church at Wilne Road',
      localauthorityname: 'Derbyshire',
      parent: '034WAF409',
      quickdialnumber: '306046',
      riverorsea: 'River Derwent',
      geom: '{}',
      centroid: '{"type":"Point","coordinates":[-1.33764872652984,52.8785953176783]}'
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    stub.revert()
  })

  lab.test('GET / route works for /floods', async () => {
    const options = {
      method: 'GET',
      url: '/floods'

    }

    const stub = mock.replace(services, 'getFloods', mock.makePromise(null, {
      floods:
      {
        code: '061WAF07Cole',
        key: 175364,
        description: 'River Cole and Dorcan Brook',
        quickdialnumber: '171235',
        region: 'South East',
        area: 'West Thames',
        floodtype: 'f',
        severity: 3,
        severitydescription: 'Flood Alert',
        warningkey: 106274,
        raised: '2019-07-24T06:17:00.000Z',
        severitychanged: '2019-07-24T06:17:00.000Z',
        messagechanged: '2019-07-24T06:17:00.000Z',
        message: 'Property flooding is not currently expected.\nRiver levels have risen on the River Cole at Lower Stratton as a result of thunderstorms overnight. River levels have peaked and are expected to start falling soon, with no further rise forecasted.\nOur incident response staff are monitoring the situation. This message will be updated this afternoon',
        geometry: '{\'type:\'Point\',\'coordinates:[-1.69232110253823,51.6047668691946]}'
      },
      timestamp: '1563969242'
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    stub.revert()
  })

  lab.test('GET / route works for /floods-within/{x1}/{y1}/{x2}/{y2} ', async () => {
    const options = {
      method: 'GET',
      url: '/floods-within/-2.5353000164031982/53.420841217041016/-2.6395580768585205/53.36753845214844'

    }

    const stub = mock.replace(services, 'getFloodsWithin', mock.makePromise(null, {
      floods: []
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    stub.revert()
  })

  lab.test('GET / route works for /impacts-within/{x1}/{y1}/{x2}/{y2} ', async () => {
    const options = {
      method: 'GET',
      url: '/impacts-within/-2.5353000164031982/53.420841217041016/-2.6395580768585205/53.36753845214844'

    }

    const stub = mock.replace(services, 'getImpactDataWithin', mock.makePromise(null, {
      impactid: 2931,
      gauge: 'River Thames at Windsor',
      rloiid: 7170,
      value: '5.72',
      units: 'mALD',
      geom: '0101000020E61000008F183DB7D095E2BFFB93F8DC09BE4940',
      coordinates: '{"type":"Point","coordinates":[-0.580788,51.484676]}',
      comment: '29 properties flooded. Properties located on Priory Way, Southlea Road, The Green, Elmcroft, Penn Road, Talbot Place, Horton Road and Slough Road',
      shortname: 'Property flooding Priory Way',
      description: 'Flooding to properties on Priory Way, Datchet',
      type: 'Property Impact',
      obsfloodyear: '2014',
      obsfloodmonth: 'February',
      source: 'Flood Resiliance',
      telemetrylatest: '3.324',
      telemetryactive: false,
      forecastmax: '3.369',
      forecastactive: false
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    stub.revert()
  })

  lab.test('GET / route works for /impacts/{id} ', async () => {
    const options = {
      method: 'GET',
      url: '/impacts/7333'

    }

    const stub = mock.replace(services, 'getImpactData', mock.makePromise(null, {
      impactid: 2614,
      gauge: 'River Lee at Waterhall',
      rloiid: 7333,
      value: '0.502',
      units: 'mALD',
      geom: '0101000020E6100000DA1D520C9068BABFF12BD67091E34940',
      coordinates: '{\'type:\'Point\',\'coordinates:[-0.103158,51.777876]}',
      shortname: 'Flooding to Bayfordbury Road',
      description: 'Flooding to Bayfordbury Road',
      type: 'Road Impact',
      obsfloodyear: null,
      obsfloodmonth: null,
      source: 'Flood Resiliance',
      telemetrylatest: '0.113',
      telemetryactive: false,
      forecastmax: '0.104',
      forecastactive: false

    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    stub.revert()
  })

  lab.test('GET / route works on /is-england/{x}/{y}', async () => {
    const result = { is_england: true }

    const isEngland = sandbox.stub(services, 'isEngland')
    isEngland.returns(result)

    const options = {
      method: 'GET',
      url: '/is-england/-2.2370500564575195/53.4650993347168'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    Code.expect(response.payload).to.include('true')
  })

  lab.test('GET / route works for /station/{rloiId}/{direction} ', async () => {
    const options = {
      method: 'GET',
      url: '/station/7333/u'

    }

    const stub = mock.replace(services, 'getStation', mock.makePromise(null, {
      rloi_id: 7333,
      station_type: 'S',
      qualifier: 'u',
      telemetry_context_id: '745909',
      telemetry_id: '4690TH',
      wiski_id: '4690TH',
      post_process: false,
      subtract: null,
      region: 'Thames',
      area: 'Hertfordshre and North London',
      catchment: 'Upper Lee',
      display_region: 'South East',
      display_area: 'North East Thames',
      display_catchment: 'Upper Lee',
      agency_name: 'Waterhall',
      external_name: 'Waterhall',
      location_info: 'Birch Green',
      x_coord_actual: 529980,
      y_coord_actual: 209950,
      actual_ngr: 'TL2998009950',
      x_coord_display: 529980,
      y_coord_display: 209950,
      site_max: '2',
      wiski_river_name: 'River Lee',
      date_open: '1985-01-01T00:00:00.000Z',
      stage_datum: '43.594',
      period_of_record: 'to date',
      por_max_value: '1.155',
      date_por_max: '2014-02-07T08:15:00.000Z',
      highest_level: '1.155',
      date_highest_level: '2014-02-07T08:15:00.000Z',
      por_min_value: '0.045',
      date_por_min: '1990-07-09T20:15:00.000Z',
      percentile_5: '0.5',
      percentile_95: '0.12',
      comments: '',
      status: 'Active',
      status_reason: '',
      status_date: null,
      coordinates: '{\'type:\'Point\',\'coordinates:[-0.11752917367099,51.7731387828853]}',
      geography: '0101000020E6100000AB283E556416BEBF7AE12D36F6E24940',
      centroid: '0101000020E6100000AB283E556416BEBF7AE12D36F6E24940'
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    stub.revert()
  })

  lab.test('GET / route works for /station/{id}/{direction}/telemetry ', async () => {
    const options = {
      method: 'GET',
      url: '/station/7333/u/telemetry'

    }

    const stub = mock.replace(services, 'getStationTelemetry', mock.makePromise(null,
      [
        {
          ts: '2019-07-24T12:00Z',
          _: 0.113,
          err: false
        },
        {
          ts: '2019-07-24T11:45Z',
          _: 0.113,
          err: false
        }]))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    stub.revert()
  })

  lab.test('GET / route works for /station/{telemetryId}/forecast/data ', async () => {
    const options = {
      method: 'GET',
      url: '/station/L2406/forecast/data'

    }

    const stub = mock.replace(s3Service, 'ffoi', mock.makePromise(null,

      {
        $: {
          stationReference: 'L2406',
          region: 'North East',
          stationName: 'York Viking Recorder',
          key: 'fwfidata/ENT_7024/NEFSNETS20190725075356053.XML',
          date: '2019-07-25',
          time: '07:53:56'
        },
        SetofValues: [
          {
            $: {
              parameter: 'Water Level',
              qualifier: 'Stage',
              dataType: 'Instantaneous',
              period: '15 min',
              characteristic: 'Forecast',
              units: 'm',
              startDate: '2019-07-24',
              startTime: '07:45:00',
              endDate: '2019-07-26',
              endTime: '08:00:00'
            },
            Value: [
              {
                _: '0.376',
                $: {
                  date: '2019-07-25',
                  time: '00:00:00',
                  flag1: '1'
                }
              },
              {
                _: '0.376',
                $: {
                  date: '2019-07-25',
                  time: '00:15:00',
                  flag1: '1'
                }

              }
            ]
          }
        ]
      }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    stub.revert()
  })

  lab.test('GET / route works for /station/{id}/forecast/thresholds ', async () => {
    const options = {
      method: 'GET',
      url: '/station/7225/forecast/thresholds'

    }

    const stub = mock.replace(services, 'getFFOIThresholds', mock.makePromise(null, {}))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    stub.revert()
  })

  lab.test('GET /flood-guidance-statement ', async () => {
    const options = {
      method: 'GET',
      url: '/flood-guidance-statement'
    }

    const stub = mock.replace(s3Service, 'floodGuidanceStatement', mock.makePromise(null, {}))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    stub.revert()
  })

  lab.test('GET /flood-guidance-statement error', async () => {
    const options = {
      method: 'GET',
      url: '/flood-guidance-statement'
    }

    const stub = mock.replace(s3Service, 'floodGuidanceStatement', mock.makePromise(new Error('test error')))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    stub.revert()
  })

  lab.test('GET / webops health check', async () => {
    const options = {
      method: 'GET',
      url: '/'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
  })

  lab.test('GET /stations-health webops health check', async () => {
    const options = {
      method: 'GET',
      url: '/stations-health'
    }

    const stub = mock.replace(services, 'getStationsHealth', mock.makePromise(null, {
      rows: []
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    stub.revert()
  })

  lab.test('GET /telemetry-health health check', async () => {
    const options = {
      method: 'GET',
      url: '/telemetry-health'
    }

    const stub = mock.replace(services, 'getTelemetryHealth', mock.makePromise(null, {
      rows: []
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    stub.revert()
  })

  lab.test('GET /ffoi-health health check', async () => {
    const options = {
      method: 'GET',
      url: '/ffoi-health'
    }

    const stub = mock.replace(services, 'getFfoiHealth', mock.makePromise(null, {
      rows: []
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    stub.revert()
  })

  lab.test('GET / route works for /stations-within-target-area', async () => {
    const options = {
      method: 'GET',
      url: '/stations-within-target-area/053WAF117BED'
    }

    const stub = mock.replace(services, 'getStationsWithinTargetArea', mock.makePromise(null, {
      rows: []
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    stub.revert()
  })

  lab.test('GET / route works for /river/{riverid}', async () => {
    const options = {
      method: 'GET',
      url: '/river/123'
    }

    sandbox.stub(services, 'getRiverById').returns([])

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
  })
  lab.test('GET / route works for /river-station-by-station-id/{stationId}', async () => {
    const options = {
      method: 'GET',
      url: '/river-station-by-station-id/123'
    }

    sandbox.stub(services, 'getRiverStationByStationId').returns([])

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
  })
  lab.test('GET / route works for /stations-overview', async () => {
    const options = {
      method: 'GET',
      url: '/stations-overview'
    }

    sandbox.stub(services, 'getStationsOverview').returns([])

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
  })
  lab.test('GET / route works for /warnings-alerts-within-station-buffer/{long}/{lat}', async () => {
    const options = {
      method: 'GET',
      url: '/warnings-alerts-within-station-buffer/1/1'
    }

    sandbox.stub(services, 'getWarningsAlertsWithinStationBuffer').returns([])

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
  })
})
