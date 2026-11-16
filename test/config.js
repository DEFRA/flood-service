let connectionString
let s3AccessKey
let s3SecretKey
let s3Region
let s3Bucket

describe('Config test', () => {
  beforeEach(() => {
    connectionString = process.env.FLOOD_SERVICE_CONNECTION_STRING
    s3AccessKey = process.env.FLOOD_SERVICE_S3_ACCESS_KEY
    s3SecretKey = process.env.FLOOD_SERVICE_S3_SECRET_ACCESS_KEY
    s3Region = process.env.FLOOD_SERVICE_S3_REGION
    s3Bucket = process.env.FLOOD_SERVICE_S3_BUCKET
    delete process.env.FLOOD_SERVICE_CONNECTION_STRING
    jest.resetModules()
  })

  afterEach(() => {
    process.env.FLOOD_SERVICE_CONNECTION_STRING = connectionString
    process.env.FLOOD_SERVICE_S3_ACCESS_KEY = s3AccessKey
    process.env.FLOOD_SERVICE_S3_SECRET_ACCESS_KEY = s3SecretKey
    process.env.FLOOD_SERVICE_S3_REGION = s3Region
    process.env.FLOOD_SERVICE_S3_BUCKET = s3Bucket
    jest.resetModules()
  })

  test('Check bad config fails', () => {
    expect(() => { require('../server/config') }).toThrow()
  })

  test('Config should accept empty S3 credentials for IAM role fallback', () => {
    process.env.FLOOD_SERVICE_CONNECTION_STRING = 'postgresql://user:pass@host:5432/db'
    process.env.FLOOD_SERVICE_S3_ACCESS_KEY = ''
    process.env.FLOOD_SERVICE_S3_SECRET_ACCESS_KEY = ''
    process.env.FLOOD_SERVICE_S3_REGION = 'eu-west-2'
    process.env.FLOOD_SERVICE_S3_BUCKET = 'test-bucket'

    const config = require('../server/config')
    expect(config.s3.accessKey).toBe('')
    expect(config.s3.secretAccessKey).toBe('')
    expect(config.s3.region).toBe('eu-west-2')
    expect(config.s3.bucket).toBe('test-bucket')
  })

  test('Config should accept undefined S3 credentials for IAM role fallback', () => {
    process.env.FLOOD_SERVICE_CONNECTION_STRING = 'postgresql://user:pass@host:5432/db'
    delete process.env.FLOOD_SERVICE_S3_ACCESS_KEY
    delete process.env.FLOOD_SERVICE_S3_SECRET_ACCESS_KEY
    process.env.FLOOD_SERVICE_S3_REGION = 'eu-west-2'
    process.env.FLOOD_SERVICE_S3_BUCKET = 'test-bucket'

    const config = require('../server/config')
    expect(config.s3.accessKey).toBeUndefined()
    expect(config.s3.secretAccessKey).toBeUndefined()
    expect(config.s3.region).toBe('eu-west-2')
    expect(config.s3.bucket).toBe('test-bucket')
  })

  test('Config should accept valid S3 credentials', () => {
    process.env.FLOOD_SERVICE_CONNECTION_STRING = 'postgresql://user:pass@host:5432/db'
    process.env.FLOOD_SERVICE_S3_ACCESS_KEY = 'test-key'
    process.env.FLOOD_SERVICE_S3_SECRET_ACCESS_KEY = 'test-secret'
    process.env.FLOOD_SERVICE_S3_REGION = 'eu-west-2'
    process.env.FLOOD_SERVICE_S3_BUCKET = 'test-bucket'

    const config = require('../server/config')
    expect(config.s3.accessKey).toBe('test-key')
    expect(config.s3.secretAccessKey).toBe('test-secret')
    expect(config.s3.region).toBe('eu-west-2')
    expect(config.s3.bucket).toBe('test-bucket')
  })

  test('Config should fail when S3 region is missing', () => {
    process.env.FLOOD_SERVICE_CONNECTION_STRING = 'postgresql://user:pass@host:5432/db'
    process.env.FLOOD_SERVICE_S3_ACCESS_KEY = 'test-key'
    process.env.FLOOD_SERVICE_S3_SECRET_ACCESS_KEY = 'test-secret'
    delete process.env.FLOOD_SERVICE_S3_REGION
    process.env.FLOOD_SERVICE_S3_BUCKET = 'test-bucket'

    expect(() => { require('../server/config') }).toThrow()
  })

  test('Config should fail when S3 bucket is missing', () => {
    process.env.FLOOD_SERVICE_CONNECTION_STRING = 'postgresql://user:pass@host:5432/db'
    process.env.FLOOD_SERVICE_S3_ACCESS_KEY = 'test-key'
    process.env.FLOOD_SERVICE_S3_SECRET_ACCESS_KEY = 'test-secret'
    process.env.FLOOD_SERVICE_S3_REGION = 'eu-west-2'
    delete process.env.FLOOD_SERVICE_S3_BUCKET

    expect(() => { require('../server/config') }).toThrow()
  })
})
