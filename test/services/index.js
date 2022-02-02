'use strict'

const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const lab = exports.lab = Lab.script()
const sinon = require('sinon')
const db = require('../../server/services/db')
const services = require('../../server/services/index.js')

lab.experiment('Services tests', () => {
  lab.afterEach(async () => {
    await sinon.restore()
  })
  lab.experiment('getFloods', () => {
    const getFloodsData = () => {
      return [
        {
          command: 'SELECT',
          rowCount: 1,
          oid: null,
          rows: [
            {
              code: 'JFS013FWFD5',
              key: 174393,
              description: 'River Goyt at Whaley Bridge',
              quickdialnumber: '143052',
              region: 'North West',
              area: 'South',
              floodtype: 'f',
              severity: 1,
              severitydescription: 'Severe Flood Warning',
              warningkey: 106435,
              raised: '2019-08-01T12:51:00.000Z',
              severitychanged: '2019-08-01T12:51:00.000Z',
              messagechanged: '2019-08-01T12:51:00.000Z',
              message: 'River levels in the River Goyt could rise rapidly as a result of water coming from Toddbrook Reservoir on 01/08/2019 at 14:00. Evacuation plans are currently underway for the area of Whaley Bridge. If you believe that you are in immediate danger, please call 999. Please be aware of your surroundings, keep up to date with the current situation, and avoid using low lying footpaths near local watercourses.',
              geometry: {
                type: 'Point',
                coordinates: [-1.98390234673153, 53.3296569611127]
              }
            }
          ]
        },
        {
          command: 'SELECT',
          rowCount: 1,
          oid: null,
          rows: [{ timestamp: '1564671241' }],
          fields: [{
            name: 'timestamp',
            tableID: 90493,
            columnID: 2,
            dataTypeID: 20,
            dataTypeSize: 8,
            dataTypeModifier: -1,
            format: 'text'
          }],
          _parsers: [null],
          RowCtor: null,
          rowAsArray: false
        }
      ]
    }
    lab.test('should return flood data', async () => {
      sinon.stub(db, 'query').callsFake(getFloodsData)

      const result = await services.getFloods()

      await Code.expect(result).to.be.an.object()
      await Code.expect(result.floods[0].code).to.equal('JFS013FWFD5')
    })
    lab.test('should pass query only', async () => {
      const mock = sinon.mock(db)
        .expects('query')
        .withArgs('getFloods')
        .once()
        .returns(getFloodsData())
      await services.getFloods()
      mock.verify()
    })
  })
  lab.experiment('getFloodsWithin', () => {
    const getFloodsWithinData = () => {
      return {
        command: 'SELECT',
        rowCount: 0,
        oid: null,
        rows: [],
        fields:
        [],
        _parsers: []
      }
    }
    const bbox = [-2.5353000164031982, 53.420841217041016, -2.6395580768585205, 53.36753845214844]
    lab.test('should return flood within data', async () => {
      sinon.stub(db, 'query').callsFake(getFloodsWithinData)

      const result = await services.getFloodsWithin(bbox)

      await Code.expect(result.floods).to.be.an.array()
    })
    lab.test('should pass query and bbox', async () => {
      const mock = sinon.mock(db)
        .expects('query')
        .withArgs('getFloodsWithin', bbox)
        .once()
        .returns(getFloodsWithinData())
      await services.getFloodsWithin(bbox)
      mock.verify()
    })
  })
  lab.experiment('getAlertArea', () => {
    const getAlertAreaData = () => {
      return {
        command: 'SELECT',
        rowCount: 1,
        oid: null,
        rows:
        [{
          id: 5038,
          area: 'Lincs and Northants',
          code: '055WAF139GBE',
          name: 'Lower Glen and Bourne Eau System',
          description: 'Lower River Glen from Kates Bridge to Surfleet Seas End, including the Bourne Eau in Bourne and the area around Baston and Pinchbeck',
          localauthorityname: 'Lincolnshire',
          quickdialnumber: '207032',
          riverorsea: 'River Glen, Bourne Eau System',
          geom: '{"type":"MultiPolygon","coordinates":[[]]}',
          centroid: '{"type":"Point","coordinates":[-0.279974216515124,52.7647656448618]}'
        }],
        fields: [],
        _parsers: [],
        RowCtor: null,
        rowAsArray: false
      }
    }
    lab.test('should return alert data', async () => {
      sinon.stub(db, 'query').callsFake(getAlertAreaData)

      const code = '061WAF07Cole'

      const result = await services.getAlertArea(code)

      await Code.expect(result.id).to.equal(5038)
    })
    lab.test('should pass query and code', async () => {
      const mock = sinon.mock(db)
        .expects('query')
        .withArgs('getAlertArea', ['A1'])
        .once()
        .returns(getAlertAreaData())
      await services.getAlertArea('A1')
      mock.verify()
    })
  })
  lab.experiment('getWarningArea', () => {
    const getWarningAreaData = () => {
      return {
        command: 'SELECT',
        rowCount: 1,
        oid: null,
        rows:
        [{
          id: 22517,
          area: 'East Midlands',
          code: '034FWFDECHURCHW',
          name: 'River Derwent at Church Wilne and Wilne Lane',
          description: 'River Derwent at Church Wilne and Wilne Lane including Saint Chad\'s Church at Wilne Road',
          localauthorityname: 'Derbyshire',
          parent: '034WAF409',
          quickdialnumber: '306046',
          riverorsea: 'River Derwent',
          geom: '{"type":"MultiPolygon","coordinates":[[[[-1.33544746953363,52.8848482501047],[-1.33546067152289,52.8848434955537],[-1.33546748800289,52.8848472610617],[-1.33585013571403,52.8851005127339],[-1.33585454725095,52.8851057037314],[-1.33584767927105,52.8851101202737],[-1.33570052722019,52.8851895514517],[-1.33569221189659,52.8851930046462],[-1.33568677900119,52.8851905101913],[-1.33530719077225,52.8849474525291],[-1.33528257328667,52.8849317287493],[-1.33529240254894,52.8849249600388],[-1.33544746953363,52.8848482501047]]],[[[-1.33370625439746,52.8819197529596],[-1.33482356188233,52.8817372272285],[-1.33516673745288,52.8826201165064],[-1.33413966345575,52.8827312345939],[-1.33370625439746,52.8819197529596]]],[[[-1.33852495787706,52.8806791292156],[-1.33750299388078,52.8804576935391],[-1.3372268335974,52.8800516275704],[-1.33646960335432,52.8800114478567],[-1.33509586640155,52.8794733962017],[-1.33396485875377,52.879583932065],[-1.33236251247491,52.8794221275349],[-1.33187384688512,52.8793115097113],[-1.33447329914901,52.8784001639469],[-1.33543905745595,52.8784055635089],[-1.33589923908392,52.8784351021311],[-1.33733265891451,52.8789554980095],[-1.33980754861945,52.8793917665998],[-1.34215541191797,52.8793867955656],[-1.34267192306564,52.8796233781237],[-1.3430391788855,52.8799040817189],[-1.34309278599214,52.8802909264849],[-1.34294027079286,52.8805507797206],[-1.34179453157455,52.880652319232],[-1.34134809414551,52.8806947955001],[-1.34065069115199,52.8806280051644],[-1.33852495787706,52.8806791292156]]],[[[-1.33609754416278,52.8728992550483],[-1.33610103734122,52.8726699029974],[-1.33570654351593,52.8726725719189],[-1.33569519039541,52.8726726349869],[-1.33568095414035,52.872671847974],[-1.337525802976,52.8712095306907],[-1.33767506308291,52.871091214242],[-1.3376815395069,52.8710873668802],[-1.33769787470883,52.871090202975],[-1.3377097302831,52.8710930722078],[-1.33811220239485,52.8712002457596],[-1.33813042187394,52.8712076162264],[-1.33834305878151,52.8713141492902],[-1.3383543718489,52.8713220850833],[-1.33835552078583,52.8713266062381],[-1.33837984381486,52.8716231197956],[-1.33838010252982,52.8716269999779],[-1.33838011723373,52.871627272737],[-1.33838600066076,52.8717702974466],[-1.33838559983568,52.8717772442891],[-1.33838191245489,52.8717810767237],[-1.33809275649464,52.8720264793205],[-1.33652850090041,52.8733539802987],[-1.33652837119947,52.8733539584939],[-1.33652172432197,52.8733498623933],[-1.33611053718437,52.8730114175582],[-1.3361035793033,52.8730054441108],[-1.33609778345859,52.8730000428868],[-1.33609616291722,52.8729899427985],[-1.33609754416278,52.8728992550483]]]]}',
          centroid: '{"type":"Point","coordinates":[-1.33764872652984,52.8785953176783]}'
        }],
        fields: [{
          name: 'id',
          tableID: 90814,
          columnID: 1,
          dataTypeID: 23,
          dataTypeSize: 4,
          dataTypeModifier: -1,
          format: 'text'
        },
        {
          name: 'area',
          tableID: 90814,
          columnID: 2,
          dataTypeID: 1043,
          dataTypeSize: -1,
          dataTypeModifier: 104,
          format: 'text'
        },
        {
          name: 'code',
          tableID: 90814,
          columnID: 3,
          dataTypeID: 1043,
          dataTypeSize: -1,
          dataTypeModifier: 54,
          format: 'text'
        }],
        _parsers: [],
        RowCtor: null,
        rowAsArray: false
      }
    }
    lab.test('Check should return data', async () => {
      sinon.stub(db, 'query').callsFake(getWarningAreaData)

      const code = '034FWFDECHURCHW'

      const result = await services.getWarningArea(code)
      await Code.expect(result).to.be.an.object()
      await Code.expect(result.id).to.equal(22517)
    })
    lab.test('should pass query and code', async () => {
      const mock = sinon.mock(db)
        .expects('query')
        .withArgs('getWarningArea', ['A1'])
        .once()
        .returns(getWarningAreaData())
      await services.getWarningArea('A1')
      mock.verify()
    })
  })
  lab.experiment('getStation', () => {
    const getStationData = () => {
      return {
        command: 'SELECT',
        rowCount: 1,
        oid: null,
        rows:
        [{
          id: 5038,
          area: 'Lincs and Northants',
          code: '055WAF139GBE',
          name: 'Lower Glen and Bourne Eau System',
          description: 'Lower River Glen from Kates Bridge to Surfleet Seas End, including the Bourne Eau in Bourne and the area around Baston and Pinchbeck',
          localauthorityname: 'Lincolnshire',
          quickdialnumber: '207032',
          riverorsea: 'River Glen, Bourne Eau System',
          geom: '{"type":"MultiPolygon","coordinates":[[]]}',
          centroid: '{"type":"Point","coordinates":[-0.279974216515124,52.7647656448618]}'
        }],
        fields: [],
        _parsers: [],
        RowCtor: null,
        rowAsArray: false
      }
    }
    lab.test('should return data', async () => {
      sinon.stub(db, 'query').callsFake(getStationData)

      const id = 7333
      const direction = 'u'

      const result = await services.getStation(id, direction)

      await Code.expect(result).to.be.an.object()
      await Code.expect(result.id).to.equal(5038)
    })
    lab.test('should pass query, id and direction', async () => {
      const mock = sinon.mock(db)
        .expects('query')
        .withArgs('getStation', [123, 'u'])
        .once()
        .returns(getStationData())
      await services.getStation(123, 'u')
      mock.verify()
    })
  })
  lab.experiment('Check getStations service', () => {
    const getStationsData = () => {
      return {
        command: 'SELECT',
        rowCount: 1,
        oid: null,
        rows:
        [{
          rloi_id: 5050,
          telemetry_id: '694063',
          region: 'North West',
          catchment: 'Lower Mersey',
          wiski_river_name: 'River Mersey',
          agency_name: 'Fiddlers Ferry',
          external_name: 'Fiddlers Ferry',
          station_type: 'S',
          status: 'Active',
          qualifier: 'u',
          iswales: false,
          value: '2.638',
          value_timestamp: '2019-08-02T07:15:00.000Z',
          value_erred: false,
          percentile_5: '6.2',
          percentile_95: '2.611'
        }],
        fields: [],
        _parsers: [],
        RowCtor: null,
        rowAsArray: false
      }
    }
    lab.test('Check getStations service', async () => {
      sinon.stub(db, 'query').callsFake(getStationsData)

      const result = await services.getStations()

      await Code.expect(result).to.be.an.array()
      await Code.expect(result[0].rloi_id).to.equal(5050)
    })
    lab.test('should pass query and bbox', async () => {
      const mock = sinon.mock(db)
        .expects('query')
        .withArgs('getStations')
        .once()
        .returns(getStationsData())
      await services.getStations()
      mock.verify()
    })
  })
  lab.experiment('Check getStationsWithin service', () => {
    const getStationsWithinData = () => {
      return {
        command: 'SELECT',
        rowCount: 1,
        oid: null,
        rows:
        [{
          rloi_id: 5050,
          telemetry_id: '694063',
          region: 'North West',
          catchment: 'Lower Mersey',
          wiski_river_name: 'River Mersey',
          agency_name: 'Fiddlers Ferry',
          external_name: 'Fiddlers Ferry',
          station_type: 'S',
          status: 'Active',
          qualifier: 'u',
          iswales: false,
          value: '2.638',
          value_timestamp: '2019-08-02T07:15:00.000Z',
          value_erred: false,
          percentile_5: '6.2',
          percentile_95: '2.611'
        }],
        fields: [],
        _parsers: [],
        RowCtor: null,
        rowAsArray: false
      }
    }
    const bbox = [-2.5353000164031982, 53.420841217041016, -2.6395580768585205, 53.36753845214844]
    lab.test('Check getStationsWithin service', async () => {
      sinon.stub(db, 'query').callsFake(getStationsWithinData)

      const result = await services.getStationsWithin(bbox)

      await Code.expect(result).to.be.an.array()
      await Code.expect(result[0].rloi_id).to.equal(5050)
    })
    lab.test('should pass query and bbox', async () => {
      const mock = sinon.mock(db)
        .expects('query')
        .withArgs('getStationsWithin', bbox)
        .once()
        .returns(getStationsWithinData())
      await services.getStationsWithin(bbox)
      mock.verify()
    })
  })
  lab.experiment('getStationTelemetry', () => {
    const stationTelemetryData = {
      command: 'SELECT',
      rowCount: 1,
      oid: null,
      rows:
      [{
        get_telemetry: [
          { ts: '2019-08-05T04:30Z', _: 0.096, err: false },
          { ts: '2019-08-05T04:15Z', _: 0.097, err: false },
          { ts: '2019-08-05T04:00Z', _: 0.097, err: false },
          { ts: '2019-08-05T03:45Z', _: 0.097, err: false }
        ]
      }],
      fields: [],
      _parsers: [],
      RowCtor: null,
      rowAsArray: false
    }
    lab.test('should return data', async () => {
      sinon.stub(db, 'query').returns(stationTelemetryData)

      const id = '7333'
      const direction = 'u'

      const result = await services.getStationTelemetry(id, direction)

      await Code.expect(result).to.be.an.array()
      await Code.expect(result[0]._).to.equal(0.096)
    })
    lab.test('should handle empty results', async () => {
      const stationTelemetryData = {
        command: 'SELECT',
        rowCount: 1,
        oid: null,
        rows:
        [{
          get_telemetry: []
        }],
        fields: [],
        _parsers: [],
        RowCtor: null,
        rowAsArray: false
      }

      sinon.stub(db, 'query').returns(stationTelemetryData)

      const id = '7333'
      const direction = 'u'

      const result = await services.getStationTelemetry(id, direction)

      await Code.expect(result).to.be.an.array()
      await Code.expect(result.length).to.equal(0)
    })
    lab.test('should handle null results', async () => {
      const stationTelemetryData = {
        command: 'SELECT',
        rowCount: 1,
        oid: null,
        rows:
        [{}],
        fields: [],
        _parsers: [],
        RowCtor: null,
        rowAsArray: false
      }

      sinon.stub(db, 'query').returns(stationTelemetryData)

      const id = '7333'
      const direction = 'u'

      const result = await services.getStationTelemetry(id, direction)

      await Code.expect(result).to.be.an.array()
      await Code.expect(result.length).to.equal(0)
    })
    lab.test('should pass query, id and direction', async () => {
      const mock = sinon.mock(db)
        .expects('query')
        .withArgs('getStationTelemetry', [123, 'u'])
        .once()
        .returns(stationTelemetryData)
      await services.getStationTelemetry(123, 'u')
      mock.verify()
    })
  })
  lab.experiment('getFFOIThresholds', () => {
    const ffoiThresholdsData = {
      command: 'SELECT',
      rowCount: 1,
      oid: null,
      rows:
      [{
        ffoi_get_thresholds: []
      }],
      fields: [],
      _parsers: [],
      RowCtor: null,
      rowAsArray: false
    }
    lab.test('should return threshold data', async () => {
      sinon.stub(db, 'query').returns(ffoiThresholdsData)

      const id = '7333'

      const result = await services.getFFOIThresholds(id)

      await Code.expect(result).to.be.an.array()
    })
    lab.test('should handle null threshold data', async () => {
      ffoiThresholdsData.rows = [{}]
      sinon.stub(db, 'query').returns(ffoiThresholdsData)

      const id = '7333'

      const result = await services.getFFOIThresholds(id)

      await Code.expect(result).to.be.an.array()
    })
    lab.test('should pass query and id', async () => {
      const mock = sinon.mock(db)
        .expects('query')
        .withArgs('getFFOIThresholds', [123])
        .once()
        .returns(ffoiThresholdsData)
      await services.getFFOIThresholds(123)
      mock.verify()
    })
  })
  lab.experiment('isEngland', () => {
    const isEnglandData = () => {
      return {
        command: 'SELECT',
        rowCount: 1,
        oid: null,
        rows: [{ is_england: true }],
        fields: [{
          name: 'is_england',
          tableID: 0,
          columnID: 0,
          dataTypeID: 16,
          dataTypeSize: 1,
          dataTypeModifier: -1,
          format: 'text'
        }],
        _parsers: [],
        RowCtor: null,
        rowAsArray: false
      }
    }
    const x = '-2.2370500564575195'
    const y = '53.4650993347168'
    lab.test('should return data', async () => {
      sinon.stub(db, 'query').callsFake(isEnglandData)

      const result = await services.isEngland(x, y)

      await Code.expect(result).to.be.an.object()
      await Code.expect(result.is_england).to.equal(true)
    })
    lab.test('should pass query and coords', async () => {
      const mock = sinon.mock(db)
        .expects('query')
        .withArgs('isEngland', [x, y])
        .once()
        .returns(isEnglandData())
      await services.isEngland(x, y)
      mock.verify()
    })
  })
  lab.experiment('getImpactData', () => {
    const getImpactDataFake = () => {
      return {
        command: 'SELECT',
        rowCount: 4,
        oid: null,
        rows: [{
          impactid: 2614,
          gauge: 'River Lee at Waterhall',
          rloiid: 7333,
          value: '0.502',
          units: 'mALD',
          geom: '0101000020E6100000DA1D520C9068BABFF12BD67091E34940',
          coordinates: '{"type":"Point","coordinates":[-0.103158,51.777876]}',
          comment: 'Road flooding in Bayfordbury Rd',
          shortname: 'Flooding to Bayfordbury Road',
          description: 'Flooding to Bayfordbury Road',
          type: 'Road Impact',
          obsfloodyear: null,
          obsfloodmonth: null,
          source: 'Flood Resiliance',
          telemetrylatest: '0.096',
          telemetryactive: false,
          forecastmax: '0.098',
          forecastactive: false
        },
        {
          impactid: 2615,
          gauge: 'River Lee at Waterhall',
          rloiid: 7333,
          value: '0.728',
          units: 'mALD',
          geom: '0101000020E6100000F22554707841B4BFF3E49A0299E34940',
          coordinates: '{"type":"Point","coordinates":[-0.079124,51.778107]}',
          comment: 'Blockage on Brickendon Brook. Road closed to Pub',
          shortname: 'Flooding at Brickendon Brook',
          description: 'Flooding at Brickendon Brook, road close to pub',
          type: 'Road Impact',
          obsfloodyear: null,
          obsfloodmonth: null,
          source: 'Flood Resiliance',
          telemetrylatest: '0.096',
          telemetryactive: false,
          forecastmax: '0.098',
          forecastactive: false
        },
        {
          impactid: 2616,
          gauge: 'River Lee at Waterhall',
          rloiid: 7333,
          value: '0.745',
          units: 'mALD',
          geom: '0101000020E61000004F04711E4E60B6BFCA6B257497E44940',
          coordinates: '{"type":"Point","coordinates":[-0.087407,51.785872]}',
          comment: 'Property Flooding - Harts Horns Pub',
          shortname: 'Floodining at pub',
          description: 'Flooding at pub on Hornsmill Road',
          type: 'Property Impact',
          obsfloodyear: null,
          obsfloodmonth: null,
          source: 'Flood Resiliance',
          telemetrylatest: '0.096',
          telemetryactive: false,
          forecastmax: '0.098',
          forecastactive: false
        },
        {
          impactid: 2617,
          gauge: 'River Lee at Waterhall',
          rloiid: 7333,
          value: '0.954',
          units: 'mALD',
          geom: '0101000020E6100000F99FFCDD3B6AB8BF42D13C8045E44940',
          coordinates: '{"type":"Point","coordinates":[-0.095371,51.783371]}',
          comment: 'Property Flooding - Riverside Garden Centre, Hornsmill, Warehams Lanes',
          shortname: 'Flooding to property',
          description: 'Flooding to property',
          type: 'Property Impact',
          obsfloodyear: null,
          obsfloodmonth: null,
          source: 'Flood Resiliance',
          telemetrylatest: '0.096',
          telemetryactive: false,
          forecastmax: '0.098',
          forecastactive: false
        }],
        fields: [{
          name: 'impactid',
          tableID: 1691221,
          columnID: 1,
          dataTypeID: 23,
          dataTypeSize: 4,
          dataTypeModifier: -1,
          format: 'text'
        },
        {
          name: 'gauge',
          tableID: 1691221,
          columnID: 2,
          dataTypeID: 25,
          dataTypeSize: -1,
          dataTypeModifier: -1,
          format: 'text'
        },
        {
          name: 'rloiid',
          tableID: 1691221,
          columnID: 3,
          dataTypeID: 23,
          dataTypeSize: 4,
          dataTypeModifier: -1,
          format: 'text'
        },
        {
          name: 'value',
          tableID: 1691221,
          columnID: 4,
          dataTypeID: 1700,
          dataTypeSize: -1,
          dataTypeModifier: -1,
          format: 'text'
        }],
        _parsers: [],
        RowCtor: null,
        rowAsArray: false
      }
    }
    lab.test('should return data', async () => {
      sinon.stub(db, 'query').callsFake(getImpactDataFake)

      const id = '7333'

      const result = await services.getImpactData(id)

      await Code.expect(result).to.be.an.array()
      await Code.expect(result[0].impactid).to.equal(2614)
    })
    lab.test('erroring works', async () => {
      sinon.stub(db, 'query').throws(new Error())

      const id = 7333

      await Code.expect(services.getImpactData(id)).to.reject()
    })
    lab.test('should pass query and id', async () => {
      const mock = sinon.mock(db)
        .expects('query')
        .withArgs('getImpactsByRloiId', [123])
        .once()
        .returns(getImpactDataFake())
      await services.getImpactData(123)
      mock.verify()
    })
  })
  lab.experiment('Check getImpactDataWithin service', () => {
    const getImpactDataWithinFake = () => {
      return {
        command: 'SELECT',
        rowCount: 0,
        oid: null,
        rows: [],
        fields: [],
        _parsers: [],
        RowCtor: null,
        rowAsArray: false
      }
    }
    const bbox = [-2.5353000164031982, 53.420841217041016, -2.6395580768585205, 53.36753845214844]
    lab.test('Check getImpactDataWithin service', async () => {
      sinon.stub(db, 'query').callsFake(getImpactDataWithinFake)

      const result = await services.getImpactDataWithin(bbox)

      await Code.expect(result).to.be.an.array()
    })
    lab.test('erroring works', async () => {
      sinon.stub(db, 'query').throws(new Error())

      const bbox = [-2.5353000164031982, 53.420841217041016, -2.6395580768585205, 53.36753845214844]

      await Code.expect(services.getImpactDataWithin(bbox)).to.reject()
    })
    lab.test('should pass query and bbox', async () => {
      const mock = sinon.mock(db)
        .expects('query')
        .withArgs('getImpactsWithin', bbox)
        .once()
        .returns(getImpactDataWithinFake())
      await services.getImpactDataWithin(bbox)
      mock.verify()
    })
  })
  lab.experiment('getTargetArea', () => {
    const getTargetArea = () => {
      return {
        rows: [
          {
            fws_tacode: '054WAFSF4FG',
            ta_name: 'The River Gipping, from downstream of Needham Market, to upstream of London Road Bridge, Ipswich'
          }
        ]
      }
    }
    lab.test('Check should return data', async () => {
      sinon.stub(db, 'query').callsFake(getTargetArea)

      const result = await services.getTargetArea()
      await Code.expect(result).to.be.an.object()
      await Code.expect(result.ta_name).to.contain('The River Gipping')
      await Code.expect(result.fws_tacode).to.equal('054WAFSF4FG')
    })
    lab.test('should pass query and code', async () => {
      const mock = sinon.mock(db)
        .expects('query')
        .withArgs('getTargetArea', ['A1'])
        .once()
        .returns(getTargetArea())
      await services.getTargetArea('A1')
      mock.verify()
    })
  })
  lab.experiment('getStationsWithinTargetArea', () => {
    const getStationsWithinTargetArea = () => {
      return {
        rows: [{
          river_id: 'ampney-brook',
          river_name: 'Ampney Brook',
          navigable: true,
          view_rank: 3,
          rank: 1,
          rloi_id: 7021,
          up: null,
          down: 7022,
          telemetry_id: '0470TH',
          region: 'Thames',
          catchment: 'Cotswolds',
          wiski_river_name: 'Ampney Brook',
          agency_name: 'Ampney St Peter',
          external_name: 'Ampney St Peter',
          station_type: 'S',
          status: 'Active',
          qualifier: 'u',
          iswales: false,
          value: '0.166',
          value_timestamp: '2020-06-05T12:15:00.000Z',
          value_erred: false,
          percentile_5: '0.93',
          percentile_95: '0.044',
          centroid: '0101000020E6100000F1C8D16C443DFEBFCC1544ABF6DA4940',
          lon: -1.88995783336264,
          lat: 51.7106527407119
        }]
      }
    }
    lab.test('should return data', async () => {
      sinon.stub(db, 'query').callsFake(getStationsWithinTargetArea)

      const result = await services.getStationsWithinTargetArea()
      await Code.expect(result).to.be.an.array()
      await Code.expect(result[0].rloi_id).to.equal(7021)
    })
    lab.test('should pass query and code', async () => {
      const mock = sinon.mock(db)
      mock.expects('query').withArgs('getStationsWithinTargetArea', 'A1').once().returns({ rows: [] })
      await services.getStationsWithinTargetArea('A1')
      mock.verify()
    })
  })
  lab.experiment('getWarningsAlertsWithinStationBuffer', () => {
    const getWarningsAlertsWithinStationBuffer = () => {
      return {
        rows: [
          {
            ta_code: '061WAF06Coln',
            ta_name: 'River Coln and its tributaries',
            severity: 'Flood alert',
            severity_value: 1
          }
        ]
      }
    }
    lab.test('should return data', async () => {
      sinon.stub(db, 'query').callsFake(getWarningsAlertsWithinStationBuffer)

      const result = await services.getWarningsAlertsWithinStationBuffer()
      await Code.expect(result).to.be.an.array()
      await Code.expect(result[0].ta_code).to.equal('061WAF06Coln')
    })
    lab.test('should pass query and coords', async () => {
      const rloiId = 1001
      const mock = sinon.mock(db)
        .expects('query')
        .withArgs('getWarningsAlertsWithinStationBuffer', [rloiId])
        .once()
        .returns(getWarningsAlertsWithinStationBuffer())
      await services.getWarningsAlertsWithinStationBuffer(rloiId)
      mock.verify()
    })
  })
  lab.experiment('getRiverById', () => {
    lab.test('should return empty rows array', async () => {
      sinon.stub(db, 'query').returns({ rows: [] })
      const result = await services.getRiverById()
      await Code.expect(result).to.be.an.array()
      await Code.expect(result).to.equal([])
    })
    lab.test('should return populated rows array', async () => {
      sinon.stub(db, 'query').returns({ rows: [{ f1: 'v1' }] })
      const result = await services.getRiverById()
      await Code.expect(result).to.be.an.array()
      await Code.expect(result).to.equal([{ f1: 'v1' }])
    })
    lab.test('should pass query and river id', async () => {
      const mock = sinon.mock(db)
        .expects('query')
        .withArgs('getRiverById', [1])
        .once()
        .returns({ rows: [] })
      await services.getRiverById(1)
      mock.verify()
    })
  })
  lab.experiment('getRainfallByStation', () => {
    lab.test('should return empty rows array', async () => {
      sinon.stub(db, 'query').returns({ rows: [] })
      const result = await services.getRainfallByStation()
      await Code.expect(result).to.be.an.array()
      await Code.expect(result).to.equal([])
    })
    lab.test('should return populated rows array', async () => {
      sinon.stub(db, 'query').returns({ rows: [{ station: 'E24195', period: '15 min', value: '0.01', value_timestamp: '2022-02-02T09:15:00.000Z' }] })
      const result = await services.getRainfallByStation()
      await Code.expect(result).to.be.an.array()
      await Code.expect(result).to.equal([{ station: 'E24195', period: '15 min', value: '0.01', value_timestamp: '2022-02-02T09:15:00.000Z' }])
    })
    lab.test('should pass query and rainfall gauge id', async () => {
      const mock = sinon.mock(db)
        .expects('query')
        .withArgs('getRainfallByStation', [1])
        .once()
        .returns({ rows: [] })
      await services.getRainfallByStation(1)
      mock.verify()
    })
  })
  lab.experiment('getRiverStationByStationId', () => {
    lab.test('should return empty object for empty array', async () => {
      sinon.stub(db, 'query').returns({ rows: [] })
      const result = await services.getRiverStationByStationId()
      await Code.expect(result).to.be.an.object()
      await Code.expect(result).to.equal({})
    })
    lab.test('should return populated object for non-empty results', async () => {
      sinon.stub(db, 'query').returns({ rows: [{ f1: 'v1' }] })
      const result = await services.getRiverStationByStationId()
      await Code.expect(result).to.be.an.object()
      await Code.expect(result).to.equal({ f1: 'v1' })
    })
    lab.test('should pass query and river id', async () => {
      const mock = sinon.mock(db)
        .expects('query')
        .withArgs('getRiverStationByStationId', [1])
        .once()
        .returns({ rows: [{ f1: 'v1' }] })
      await services.getRiverStationByStationId(1)
      mock.verify()
    })
  })
  lab.experiment('getStationsHealth', () => {
    lab.test('should return count and timestamp', async () => {
      sinon.stub(db, 'query').returns([{ rows: [{ count: 123 }] }, { rows: [{ load_timestamp: 1594824684 }] }])
      const result = await services.getStationsHealth()
      await Code.expect(result).to.be.an.object()
      await Code.expect(result).to.equal({ count: 123, timestamp: 1594824684 })
    })
    lab.test('should pass query', async () => {
      const mock = sinon.mock(db)
        .expects('query')
        .withArgs('getStationsHealth')
        .once()
        .returns([{ rows: [{ count: 123 }] }, { rows: [{ load_timestamp: 1594824684 }] }])
      await services.getStationsHealth()
      mock.verify()
    })
  })
  lab.experiment('getTelemetryHealth', () => {
    lab.test('should return empty rows array', async () => {
      sinon.stub(db, 'query').returns({ rows: [] })
      const result = await services.getTelemetryHealth()
      await Code.expect(result).to.be.an.array()
      await Code.expect(result).to.equal([])
    })
    lab.test('should return populated rows array', async () => {
      sinon.stub(db, 'query').returns({ rows: [{ f1: 'v1' }] })
      const result = await services.getTelemetryHealth()
      await Code.expect(result).to.be.an.array()
      await Code.expect(result).to.equal([{ f1: 'v1' }])
    })
    lab.test('should pass query', async () => {
      const mock = sinon.mock(db)
        .expects('query')
        .withArgs('getTelemetryHealth')
        .once()
        .returns({ rows: [] })
      await services.getTelemetryHealth()
      mock.verify()
    })
  })
  lab.experiment('getFfoiHealth', () => {
    lab.test('should return empty rows array', async () => {
      sinon.stub(db, 'query').returns({ rows: [] })
      const result = await services.getFfoiHealth()
      await Code.expect(result).to.be.an.array()
      await Code.expect(result).to.equal([])
    })
    lab.test('should return populated rows array', async () => {
      sinon.stub(db, 'query').returns({ rows: [{ f1: 'v1' }] })
      const result = await services.getFfoiHealth()
      await Code.expect(result).to.be.an.array()
      await Code.expect(result).to.equal([{ f1: 'v1' }])
    })
    lab.test('should pass query', async () => {
      const mock = sinon.mock(db)
        .expects('query')
        .withArgs('getFfoiHealth')
        .once()
        .returns({ rows: [] })
      await services.getFfoiHealth()
      mock.verify()
    })
  })
  lab.experiment('getStationsOverview', () => {
    lab.test('should return an overview', async () => {
      sinon.stub(db, 'query').returns({ rows: [{ get_stations_overview: [{ f1: 'v1' }] }] })
      const result = await services.getStationsOverview()
      await Code.expect(result).to.be.an.array()
      await Code.expect(result).to.equal([{ f1: 'v1' }])
    })
    lab.test('should handle empty results', async () => {
      sinon.stub(db, 'query').returns({ rows: [{ get_stations_overview: [] }] })
      const result = await services.getStationsOverview()
      await Code.expect(result).to.be.an.array()
      await Code.expect(result).to.equal([])
    })
    lab.test('should handle null results', async () => {
      sinon.stub(db, 'query').returns({ rows: [{}] })
      const result = await services.getStationsOverview()
      await Code.expect(result).to.be.an.array()
      await Code.expect(result).to.equal([])
    })
    lab.test('should pass query', async () => {
      const mock = sinon.mock(db)
        .expects('query')
        .withArgs('getStationsOverview')
        .once()
        .returns({ rows: [{ get_stations_overview: [{ f1: 'v1' }] }] })
      await services.getStationsOverview()
      mock.verify()
    })
  })
})
