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

  lab.experiment('S3 client configuration tests', () => {
    let S3ClientConstructorStub
    let s3ConfigCapture

    lab.beforeEach(() => {
      delete require.cache[require.resolve('../../server/services/s3.js')]
      delete process.env.AWS_ENDPOINT_URL

      S3ClientConstructorStub = sinon.stub().callsFake((config) => {
        s3ConfigCapture = config
        return new S3Client(config)
      })
    })

    lab.afterEach(() => {
      delete process.env.AWS_ENDPOINT_URL
    })

    lab.test('should include credentials when accessKey and secretAccessKey are provided', () => {
      const configWithCreds = {
        s3: {
          accessKey: 'test-key',
          secretAccessKey: 'test-secret',
          region: 'eu-west-2',
          bucket: 'test-bucket',
          httpTimeoutMs: 5000
        }
      }

      proxyquire('../../server/services/s3', {
        '../config': configWithCreds,
        '@aws-sdk/client-s3': {
          S3Client: S3ClientConstructorStub,
          GetObjectCommand
        }
      })

      Code.expect(s3ConfigCapture).to.exist()
      Code.expect(s3ConfigCapture.credentials).to.exist()
      Code.expect(s3ConfigCapture.credentials.accessKeyId).to.equal('test-key')
      Code.expect(s3ConfigCapture.credentials.secretAccessKey).to.equal('test-secret')
      Code.expect(s3ConfigCapture.region).to.equal('eu-west-2')
    })

    lab.test('should NOT include credentials when accessKey is empty', () => {
      const configWithoutCreds = {
        s3: {
          accessKey: '',
          secretAccessKey: 'test-secret',
          region: 'eu-west-2',
          bucket: 'test-bucket',
          httpTimeoutMs: 5000
        }
      }

      proxyquire('../../server/services/s3', {
        '../config': configWithoutCreds,
        '@aws-sdk/client-s3': {
          S3Client: S3ClientConstructorStub,
          GetObjectCommand
        }
      })

      Code.expect(s3ConfigCapture).to.exist()
      Code.expect(s3ConfigCapture.credentials).to.not.exist()
      Code.expect(s3ConfigCapture.region).to.equal('eu-west-2')
    })

    lab.test('should NOT include credentials when secretAccessKey is empty', () => {
      const configWithoutCreds = {
        s3: {
          accessKey: 'test-key',
          secretAccessKey: '',
          region: 'eu-west-2',
          bucket: 'test-bucket',
          httpTimeoutMs: 5000
        }
      }

      proxyquire('../../server/services/s3', {
        '../config': configWithoutCreds,
        '@aws-sdk/client-s3': {
          S3Client: S3ClientConstructorStub,
          GetObjectCommand
        }
      })

      Code.expect(s3ConfigCapture).to.exist()
      Code.expect(s3ConfigCapture.credentials).to.not.exist()
    })

    lab.test('should NOT include credentials when both are undefined', () => {
      const configWithoutCreds = {
        s3: {
          region: 'eu-west-2',
          bucket: 'test-bucket',
          httpTimeoutMs: 5000
        }
      }

      proxyquire('../../server/services/s3', {
        '../config': configWithoutCreds,
        '@aws-sdk/client-s3': {
          S3Client: S3ClientConstructorStub,
          GetObjectCommand
        }
      })

      Code.expect(s3ConfigCapture).to.exist()
      Code.expect(s3ConfigCapture.credentials).to.not.exist()
    })

    lab.test('should include endpoint and forcePathStyle when AWS_ENDPOINT_URL is set', () => {
      process.env.AWS_ENDPOINT_URL = 'http://testurl:9000'

      const config = {
        s3: {
          accessKey: 'test-key',
          secretAccessKey: 'test-secret',
          region: 'eu-west-2',
          bucket: 'test-bucket',
          httpTimeoutMs: 5000
        }
      }

      proxyquire('../../server/services/s3', {
        '../config': config,
        '@aws-sdk/client-s3': {
          S3Client: S3ClientConstructorStub,
          GetObjectCommand
        }
      })

      Code.expect(s3ConfigCapture).to.exist()
      Code.expect(s3ConfigCapture.endpoint).to.equal('http://testurl:9000')
      Code.expect(s3ConfigCapture.forcePathStyle).to.be.true()
    })

    lab.test('should NOT include endpoint when AWS_ENDPOINT_URL is not set', () => {
      const config = {
        s3: {
          accessKey: 'test-key',
          secretAccessKey: 'test-secret',
          region: 'eu-west-2',
          bucket: 'test-bucket',
          httpTimeoutMs: 5000
        }
      }

      proxyquire('../../server/services/s3', {
        '../config': config,
        '@aws-sdk/client-s3': {
          S3Client: S3ClientConstructorStub,
          GetObjectCommand
        }
      })

      Code.expect(s3ConfigCapture).to.exist()
      Code.expect(s3ConfigCapture.endpoint).to.not.exist()
      Code.expect(s3ConfigCapture.forcePathStyle).to.not.exist()
    })
    
    lab.test('should throw error when AWS_ENDPOINT_URL is set but credentials are missing', () => {
      process.env.AWS_ENDPOINT_URL = 'http://localhost.localstack.cloud:4566'

      const configWithoutCreds = {
        s3: {
          region: 'eu-west-2',
          bucket: 'test-bucket',
          httpTimeoutMs: 5000
        }
      }

      const loadModule = () => {
        proxyquire('../../server/services/s3', {
          '../config': configWithoutCreds,
          '@aws-sdk/client-s3': {
            S3Client: S3ClientConstructorStub,
            GetObjectCommand
          }
        })
      }

      Code.expect(loadModule).to.throw(Error, 'AWS credentials (AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY) are required when AWS_ENDPOINT_URL is set for local development')
    })
  })
})
