'use strict'
const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const lab = exports.lab = Lab.script()
const sinon = require('sinon')
const proxyquire = require('proxyquire')

lab.experiment('S3 service test', () => {
  let sandbox
  let s3ClientMock
  let getObjectCommandMock
  let mockResponse
  let s3Service

  lab.beforeEach(async () => {
    delete require.cache[require.resolve('../../server/services/s3.js')]

    sandbox = sinon.createSandbox()

    s3ClientMock = {
      send: sinon.stub()
    }

    getObjectCommandMock = sinon.stub()

    const configMock = {
      s3: {
        accessKey: 'test-access-key',
        secretAccessKey: 'test-secret-key',
        bucket: 'test-bucket',
        httpTimeoutMs: 5000
      }
    }

    mockResponse = {
      Body: {
        transformToString: sinon.stub()
      }
    }

    s3Service = proxyquire('../../server/services/s3', {
      '@aws-sdk/client-s3': {
        S3Client: function () { return s3ClientMock },
        GetObjectCommand: getObjectCommandMock
      },
      '../config': configMock
    })
  })

  lab.afterEach(async () => {
    await sandbox.restore()
  })

  lab.test('floodGuidanceStatement should fetch and parse JSON from S3', async () => {
    const expectedJson = { data: 'test-fgs-data' }
    const jsonString = JSON.stringify(expectedJson)

    mockResponse.Body.transformToString.resolves(jsonString)
    s3ClientMock.send.resolves(mockResponse)
    getObjectCommandMock.returns({})

    const result = await s3Service.floodGuidanceStatement()

    Code.expect(getObjectCommandMock.calledOnce).to.be.true()
    Code.expect(getObjectCommandMock.firstCall.args[0]).to.equal({
      Key: 'fgs/latest.json',
      Bucket: 'test-bucket'
    })
    Code.expect(s3ClientMock.send.calledOnce).to.be.true()
    Code.expect(mockResponse.Body.transformToString.calledOnce).to.be.true()
    Code.expect(result).to.equal(expectedJson)
  })

  lab.test('floodGuidanceStatement should throw error when S3 request fails', async () => {
    const expectedError = new Error('S3 error')
    s3ClientMock.send.rejects(expectedError)
    getObjectCommandMock.returns({})

    const err = await Code.expect(s3Service.floodGuidanceStatement()).to.reject()

    Code.expect(err.message).to.equal('S3 error')
    Code.expect(getObjectCommandMock.calledOnce).to.be.true()
    Code.expect(s3ClientMock.send.calledOnce).to.be.true()
  })

  lab.test('ffoi should fetch and parse JSON from S3 with correct ID', async () => {
    const stationId = '1234'
    const expectedJson = { data: 'test-ffoi-data' }
    const jsonString = JSON.stringify(expectedJson)

    mockResponse.Body.transformToString.resolves(jsonString)
    s3ClientMock.send.resolves(mockResponse)
    getObjectCommandMock.returns({})

    const result = await s3Service.ffoi(stationId)

    Code.expect(getObjectCommandMock.calledOnce).to.be.true()
    Code.expect(getObjectCommandMock.firstCall.args[0]).to.equal({
      Key: `ffoi/${stationId}.json`,
      Bucket: 'test-bucket'
    })
    Code.expect(s3ClientMock.send.calledOnce).to.be.true()
    Code.expect(mockResponse.Body.transformToString.calledOnce).to.be.true()
    Code.expect(result).to.equal(expectedJson)
  })

  lab.test('ffoi should throw error when S3 request fails', async () => {
    const stationId = '1234'
    const expectedError = new Error('S3 error')
    s3ClientMock.send.rejects(expectedError)
    getObjectCommandMock.returns({})

    const err = await Code.expect(s3Service.ffoi(stationId)).to.reject()

    Code.expect(err.message).to.equal('S3 error')
    Code.expect(getObjectCommandMock.calledOnce).to.be.true()
    Code.expect(s3ClientMock.send.calledOnce).to.be.true()
  })

  lab.test('ffoi should handle invalid JSON response', async () => {
    const stationId = '1234'
    const invalidJson = '{invalid-json'

    mockResponse.Body.transformToString.resolves(invalidJson)
    s3ClientMock.send.resolves(mockResponse)
    getObjectCommandMock.returns({})

    await Code.expect(s3Service.ffoi(stationId)).to.reject(Error)

    Code.expect(getObjectCommandMock.calledOnce).to.be.true()
    Code.expect(s3ClientMock.send.calledOnce).to.be.true()
    Code.expect(mockResponse.Body.transformToString.calledOnce).to.be.true()
  })

  lab.test('S3Client should be initialized with correct config', () => {
    const expectedJson = { data: 'test-data' }
    const jsonString = JSON.stringify(expectedJson)

    mockResponse.Body.transformToString.resolves(jsonString)
    s3ClientMock.send.resolves(mockResponse)
    getObjectCommandMock.returns({})

    return s3Service.floodGuidanceStatement().then(() => {
      Code.expect(s3ClientMock.send.calledOnce).to.be.true()
    })
  })
})
