'use strict'
const { mockClient } = require('aws-sdk-client-mock')
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3')

jest.mock('../../server/config', () => ({
  s3: {
    accessKey: 'test-access-key',
    secretAccessKey: 'test-secret-key',
    bucket: 'test-bucket',
    httpTimeoutMs: 5000
  }
}))

const s3Service = require('../../server/services/s3')

describe('S3 service test', () => {
  let s3Mock
  let mockResponse

  beforeEach(() => {
    s3Mock = mockClient(S3Client)
    s3Mock.reset()

    mockResponse = {
      Body: {
        transformToString: jest.fn()
      }
    }
  })

  afterEach(() => {
    s3Mock.restore()
  })

  test('floodGuidanceStatement should fetch and parse JSON from S3', async () => {
    const expectedJson = { data: 'test-fgs-data' }
    mockResponse.Body.transformToString.mockResolvedValue(JSON.stringify(expectedJson))
    s3Mock.on(GetObjectCommand).resolves(mockResponse)
    const result = await s3Service.floodGuidanceStatement()

    const getObjectCalls = s3Mock.commandCalls(GetObjectCommand)
    expect(getObjectCalls).toHaveLength(1)
    expect(getObjectCalls[0].args[0].input).toEqual({
      Key: 'fgs/latest.json',
      Bucket: 'test-bucket'
    })
    expect(s3Mock.calls()).toHaveLength(1)
    expect(mockResponse.Body.transformToString).toHaveBeenCalledTimes(1)
    expect(result).toEqual(expectedJson)
  })

  test('floodGuidanceStatement should throw error when S3 request fails', async () => {
    s3Mock.on(GetObjectCommand).rejects(new Error('S3 error'))

    await expect(s3Service.floodGuidanceStatement()).rejects.toThrow('S3 error')
    expect(s3Mock.commandCalls(GetObjectCommand)).toHaveLength(1)
    expect(s3Mock.calls()).toHaveLength(1)
  })

  test('ffoi should fetch and parse JSON from S3 with correct ID', async () => {
    const stationId = '1234'
    const expectedJson = { data: 'test-ffoi-data' }
    mockResponse.Body.transformToString.mockResolvedValue(JSON.stringify(expectedJson))
    s3Mock.on(GetObjectCommand).resolves(mockResponse)

    const result = await s3Service.ffoi(stationId)

    const getObjectCalls = s3Mock.commandCalls(GetObjectCommand)
    expect(getObjectCalls).toHaveLength(1)
    expect(getObjectCalls[0].args[0].input).toEqual({
      Key: `ffoi/${stationId}.json`,
      Bucket: 'test-bucket'
    })
    expect(s3Mock.calls()).toHaveLength(1)
    expect(mockResponse.Body.transformToString).toHaveBeenCalledTimes(1)
    expect(result).toEqual(expectedJson)
  })

  test('ffoi should throw error when S3 request fails', async () => {
    s3Mock.on(GetObjectCommand).rejects(new Error('S3 error'))

    await expect(s3Service.ffoi('1234')).rejects.toThrow('S3 error')
    expect(s3Mock.commandCalls(GetObjectCommand)).toHaveLength(1)
    expect(s3Mock.calls()).toHaveLength(1)
  })

  test('ffoi should handle invalid JSON response', async () => {
    mockResponse.Body.transformToString.mockResolvedValue('{invalid-json')
    s3Mock.on(GetObjectCommand).resolves(mockResponse)

    await expect(s3Service.ffoi('1234')).rejects.toThrow(Error)
    expect(s3Mock.commandCalls(GetObjectCommand)).toHaveLength(1)
    expect(s3Mock.calls()).toHaveLength(1)
    expect(mockResponse.Body.transformToString).toHaveBeenCalledTimes(1)
  })

  test('S3Client should be initialized with correct config', async () => {
    const expectedJson = { data: 'test-data' }
    mockResponse.Body.transformToString.mockResolvedValue(JSON.stringify(expectedJson))
    s3Mock.on(GetObjectCommand).resolves(mockResponse)

    const result = await s3Service.floodGuidanceStatement()
    expect(s3Mock.calls()).toHaveLength(1)
    expect(result).toEqual(expectedJson)
  })

  describe('S3 client configuration tests', () => {
    let s3ConfigCapture
    const mockS3Client = jest.fn(function (config) {
      s3ConfigCapture = config
      return new S3Client(config)
    })

    // Loads a fresh copy of the service with the given s3 config and a capturing S3Client
    const loadModule = (s3Config) => {
      jest.resetModules()
      jest.doMock('../../server/config', () => ({ s3: s3Config }))
      jest.doMock('@aws-sdk/client-s3', () => ({
        ...jest.requireActual('@aws-sdk/client-s3'),
        S3Client: mockS3Client
      }))
      return require('../../server/services/s3')
    }

    const baseConfig = {
      region: 'eu-west-2',
      bucket: 'test-bucket',
      httpTimeoutMs: 5000
    }
    const missingCredsError = 'AWS credentials (AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY) are required when not running in ECS'

    beforeEach(() => {
      s3ConfigCapture = undefined
      delete process.env.AWS_ENDPOINT_URL
      delete process.env.AWS_EXECUTION_ENV
    })

    afterEach(() => {
      delete process.env.AWS_ENDPOINT_URL
      delete process.env.AWS_EXECUTION_ENV
      jest.dontMock('../../server/config')
      jest.dontMock('@aws-sdk/client-s3')
    })

    test('should include credentials when accessKey and secretAccessKey are provided', () => {
      loadModule({ ...baseConfig, accessKey: 'test-key', secretAccessKey: 'test-secret' })

      expect(s3ConfigCapture).toBeDefined()
      expect(s3ConfigCapture.credentials).toBeDefined()
      expect(s3ConfigCapture.credentials.accessKeyId).toBe('test-key')
      expect(s3ConfigCapture.credentials.secretAccessKey).toBe('test-secret')
      expect(s3ConfigCapture.region).toBe('eu-west-2')
    })

    test('should NOT include credentials when accessKey is empty in ECS', () => {
      process.env.AWS_EXECUTION_ENV = 'AWS_ECS_FARGATE'

      loadModule({ ...baseConfig, accessKey: '', secretAccessKey: 'test-secret' })

      expect(s3ConfigCapture).toBeDefined()
      expect(s3ConfigCapture.credentials).toBeUndefined()
      expect(s3ConfigCapture.region).toBe('eu-west-2')
    })

    test('should NOT include credentials when secretAccessKey is empty in ECS', () => {
      process.env.AWS_EXECUTION_ENV = 'AWS_ECS_FARGATE'

      loadModule({ ...baseConfig, accessKey: 'test-key', secretAccessKey: '' })

      expect(s3ConfigCapture).toBeDefined()
      expect(s3ConfigCapture.credentials).toBeUndefined()
    })

    test('should NOT include credentials when both are undefined in ECS', () => {
      process.env.AWS_EXECUTION_ENV = 'AWS_ECS_FARGATE'

      expect(() => loadModule(baseConfig)).not.toThrow()
      expect(s3ConfigCapture).toBeDefined()
      expect(s3ConfigCapture.credentials).toBeUndefined()
    })

    test('should throw error when credentials are missing and NOT in ECS', () => {
      expect(() => loadModule(baseConfig)).toThrow(missingCredsError)
    })

    test('should throw error when accessKey is missing and NOT in ECS', () => {
      expect(() => loadModule({ ...baseConfig, secretAccessKey: 'test-secret' })).toThrow(missingCredsError)
    })

    test('should throw error when secretAccessKey is missing and NOT in ECS', () => {
      expect(() => loadModule({ ...baseConfig, accessKey: 'test-key' })).toThrow(missingCredsError)
    })

    test('should NOT throw when in ECS (AWS_ECS_FARGATE) without credentials', () => {
      process.env.AWS_EXECUTION_ENV = 'AWS_ECS_FARGATE'

      expect(() => loadModule(baseConfig)).not.toThrow()
      expect(s3ConfigCapture.credentials).toBeUndefined()
    })

    test('should allow credentials when in ECS environment', () => {
      process.env.AWS_EXECUTION_ENV = 'AWS_ECS_FARGATE'

      expect(() => loadModule({ ...baseConfig, accessKey: 'test-key', secretAccessKey: 'test-secret' })).not.toThrow()
      expect(s3ConfigCapture.credentials).toBeDefined()
      expect(s3ConfigCapture.credentials.accessKeyId).toBe('test-key')
    })
  })
})
