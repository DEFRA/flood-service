const Lab = require('lab')
const Code = require('code')
const lab = exports.lab = Lab.script()
const createServer = require('../server')
const sinon = require('sinon')
const impactService = require('../server/services/floods.js')
const Boom = require('boom')

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
    const options = {
      method: 'GET',
      url: '/is-england/-2.2370500564575195/53.4650993347168'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
  })

  lab.test('3 - GET / route works', async () => {
    const impacts = {
      impactID: 1,
      gauge: 'River Severn at Bewdley',
      rloiID: 2001,
      value: 3.98,
      Units: 'mALD',
      location: '',
      ThresholdComment: '',
      shortName: 'Level recorded <<ObsFloodMonth>> <<ObsFloodYear>>',
      description: 'Level recorded here <<ObsFloodMonth>> <<ObsFloodYear>>',
      type: 'Historic',
      obsFloodYear: 2007,
      obsFloodMonth: 'July',
      source: 'Flood Resiliance'
    }

    let impactStub = sandbox.stub(impactService, 'getImpactData')
    impactStub.returns(impacts)

    const options = {
      method: 'GET',
      url: '/impacts/' + impacts.impactID
    }

    const response = await server.inject(options)
    let impactObj = JSON.parse(response.payload)
    Code.expect(response.statusCode).to.equal(200)
    Code.expect(impactObj).to.be.an.object()
    Code.expect(impactObj.source).to.equal('Flood Resiliance')
  })

  lab.test('4 - error works on getImpactData service', async () => {
    sandbox.stub(impactService, 'getImpactData').throws(new Error())

    const options = {
      method: 'GET',
      url: '/impacts/1'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(response.payload).to.include('Failed to get impact data')
  })
})
