const Lab = require('lab')
const Code = require('code')
const lab = exports.lab = Lab.script()
const createServer = require('../server')
const sinon = require('sinon')
const impactService = require('../server/services/floods.js')

lab.experiment('API test', () => {
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

  lab.test('1 - GET / route works and has station id and upstream station id', async () => {
    const options = {
      method: 'GET',
      url: '/stations-upstream-downstream/6180/u'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    Code.expect(response.result.upDown.id).to.equal('stations.6180')
    Code.expect(response.result.upDown.upstream[0].id).to.equal('stations.6179')
  })

  lab.test('2 - GET /impacts route works', async () => {
    const result = { is_england: true }

    const isEngland = sandbox.stub(impactService, 'isEngland')
    isEngland.returns(result)

    const options = {
      method: 'GET',
      url: '/is-england/-2.2370500564575195/53.4650993347168'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    Code.expect(response.payload).to.include('true')
  })

  lab.test('3 - Get impacts on a station', async () => {
    const impacts =
    [{ impactid: 484,
      gauge: 'River Severn at Bewdley',
      rloiid: 2001,
      value: '5',
      units: 'mALD',
      coordinates: '{"type":"Point","coordinates":[-2.312055,52.376705]}',
      comment: 'Water spills into Pewterers Alley & properties on Riverside North flooded',
      shortname: 'Flooding to Pewterers Alley',
      description: 'Flooding at Pewterers Alley',
      type: 'Road Impact',
      obsfloodyear: null,
      obsfloodmonth: null,
      source: 'Flood Resiliance' },
    { impactid: 484,
      gauge: 'River Severn at Bewdley',
      rloiid: 2001,
      value: '5',
      units: 'mALD',
      coordinates: '{"type":"Point","coordinates":[-2.312055,52.376705]}',
      comment: 'Water spills into Pewterers Alley & properties on Riverside North flooded',
      shortname: 'Flooding to Pewterers Alley',
      description: 'Flooding at Pewterers Alley',
      type: 'Road Impact',
      obsfloodyear: null,
      obsfloodmonth: null,
      source: 'Flood Resiliance' }]

    const impactStub = sandbox.stub(impactService, 'getImpactData')
    impactStub.returns(impacts)

    const options = {
      method: 'GET',
      url: '/impacts/2001'
    }

    const response = await server.inject(options)
    const impactObj = JSON.parse(response.payload)
    Code.expect(response.statusCode).to.equal(200)
    Code.expect(impactObj).to.be.an.array()
    Code.expect(impactObj[0].rloiid).to.equal(2001)
  })

  lab.test('4 - error works on getImpactData service', async () => {
    const impactStub = sandbox.stub(impactService, 'getImpactData')

    impactStub.throws(new Error())

    const options = {
      method: 'GET',
      url: '/impacts/2001'
    }

    const response = await server.inject(options)

    Code.expect(response.statusCode).to.equal(400)
    console.log(response.payload)
    Code.expect(response.payload).to.include('Failed to get impact data')
  })

  lab.test('5 - error works on isEngland service', async () => {
    sandbox.stub(impactService, 'isEngland').throws(new Error())

    const options = {
      method: 'GET',
      url: '/is-england/-2.2370500564575195/53.4650993347168'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get isEngland')
  })
})

// [{ impactid: 485,
//   gauge: 'River Severn at Bewdley',
//   rloiid: 2001,
//   value: '5',
//   units: 'mALD',
//   coordinates: '{"type":"Point","coordinates":[-2.314835,52.377867]}',
//   comment: 'Water spills into Pewterers Alley & properties on Riverside North flooded',
//   shortname: 'Property flooding Riverside North',
//   description: 'Flooding to properties on Riverside North',
//   type: 'Property Impact',
//   obsfloodyear: null,
//   obsfloodmonth: null,
//   source: 'Flood Resiliance' },
// { impactid: 484,
//   gauge: 'River Severn at Bewdley',
//   rloiid: 2001,
//   value: '5',
//   units: 'mALD',
//   coordinates: '{"type":"Point","coordinates":[-2.312055,52.376705]}',
//   comment: 'Water spills into Pewterers Alley & properties on Riverside North flooded',
//   shortname: 'Flooding to Pewterers Alley',
//   description: 'Flooding at Pewterers Alley',
//   type: 'Road Impact',
//   obsfloodyear: null,
//   obsfloodmonth: null,
//   source: 'Flood Resiliance' }]
