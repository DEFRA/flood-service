'use strict'
const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const lab = exports.lab = Lab.script()
const sinon = require('sinon')
const { mockClient } = require('aws-sdk-client-mock')
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3')
const proxyquire = require('proxyquire')

lab.experiment('S3 service test', () => {
  let sandbox
  let s3Mock
  let mockResponse
  let s3Service

  const configMock = {
    s3: {
      accessKey: 'test-access-key',
      secretAccessKey: 'test-secret-key',
      bucket: 'test-bucket',
      httpTimeoutMs: 5000
    }
  }

  lab.beforeEach(async () => {
    delete require.cache[require.resolve('../../server/services/s3.js')]
    sandbox = sinon.createSandbox()

    s3Mock = mockClient(S3Client)
    s3Mock.reset()

    mockResponse = {
      Body: {
        transformToString: sinon.stub()
      }
    }

    s3Service = proxyquire('../../server/services/s3', {
      '../config': configMock
    })
  })

  lab.afterEach(async () => {
    await sandbox.restore()
  })

  lab.test('floodGuidanceStatement should fetch and parse JSON from S3', async () => {
    const expectedJson = { data: 'test-fgs-data' }
    mockResponse.Body.transformToString.resolves(JSON.stringify(expectedJson))
    s3Mock.on(GetObjectCommand).resolves(mockResponse)
    const result = await s3Service.floodGuidanceStatement()

    const getObjectCalls = s3Mock.commandCalls(GetObjectCommand)
    Code.expect(getObjectCalls).to.have.length(1)
    Code.expect(getObjectCalls[0].args[0].input).to.equal({
      Key: 'fgs/latest.json',
      Bucket: 'test-bucket'
    })
    Code.expect(s3Mock.send.calledOnce).to.be.true()
    Code.expect(mockResponse.Body.transformToString.calledOnce).to.be.true()
    Code.expect(result).to.equal(expectedJson)
  })

  lab.test('floodGuidanceStatement should throw error when S3 request fails', async () => {
    const expectedError = new Error('S3 error')
    s3Mock.on(GetObjectCommand).rejects(expectedError)

    const err = await Code.expect(s3Service.floodGuidanceStatement()).to.reject()
    const getObjectCalls = s3Mock.commandCalls(GetObjectCommand)
    Code.expect(getObjectCalls).to.have.length(1)
    Code.expect(s3Mock.send.calledOnce).to.be.true()
    Code.expect(err.message).to.equal('S3 error')
  })

  lab.test('ffoi should fetch and parse JSON from S3 with correct ID', async () => {
    const stationId = '1234'
    const expectedJson = { data: 'test-ffoi-data' }
    mockResponse.Body.transformToString.resolves(JSON.stringify(expectedJson))
    s3Mock.on(GetObjectCommand).resolves(mockResponse)

    const result = await s3Service.ffoi(stationId)

    const getObjectCalls = s3Mock.commandCalls(GetObjectCommand)
    Code.expect(getObjectCalls).to.have.length(1)
    Code.expect(getObjectCalls[0].args[0].input).to.equal({
      Key: `ffoi/${stationId}.json`,
      Bucket: 'test-bucket'
    })
    Code.expect(s3Mock.send.calledOnce).to.be.true()
    Code.expect(mockResponse.Body.transformToString.calledOnce).to.be.true()
    Code.expect(result).to.equal(expectedJson)
  })

  lab.test('ffoi should throw error when S3 request fails', async () => {
    const stationId = '1234'
    const expectedError = new Error('S3 error')
    s3Mock.on(GetObjectCommand).rejects(expectedError)

    const err = await Code.expect(s3Service.ffoi(stationId)).to.reject()
    const getObjectCalls = s3Mock.commandCalls(GetObjectCommand)
    Code.expect(getObjectCalls).to.have.length(1)
    Code.expect(s3Mock.send.calledOnce).to.be.true()
    Code.expect(err.message).to.equal('S3 error')
  })

  lab.test('ffoi should handle invalid JSON response', async () => {
    const stationId = '1234'
    mockResponse.Body.transformToString.resolves('{invalid-json')
    s3Mock.on(GetObjectCommand).resolves(mockResponse)

    await Code.expect(s3Service.ffoi(stationId)).to.reject(Error)
    const getObjectCalls = s3Mock.commandCalls(GetObjectCommand)
    Code.expect(getObjectCalls).to.have.length(1)
    Code.expect(s3Mock.send.calledOnce).to.be.true()
    Code.expect(mockResponse.Body.transformToString.calledOnce).to.be.true()
  })

  lab.test('S3Client should be initialized with correct config', async () => {
    const expectedJson = { data: 'test-data' }
    mockResponse.Body.transformToString.resolves(JSON.stringify(expectedJson))
    s3Mock.on(GetObjectCommand).resolves(mockResponse)

    const result = await s3Service.floodGuidanceStatement()
    Code.expect(s3Mock.send.calledOnce).to.be.true()
    Code.expect(result).to.equal(expectedJson)
  })
})
