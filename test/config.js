const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()
const Code = require('@hapi/code')
let connectionString
let s3AccessKey
let s3SecretKey
let s3Region
let s3Bucket

lab.experiment('Config test', () => {
  lab.beforeEach(() => {
    connectionString = process.env.FLOOD_SERVICE_CONNECTION_STRING
    s3AccessKey = process.env.FLOOD_SERVICE_S3_ACCESS_KEY
    s3SecretKey = process.env.FLOOD_SERVICE_S3_SECRET_ACCESS_KEY
    s3Region = process.env.FLOOD_SERVICE_S3_REGION
    s3Bucket = process.env.FLOOD_SERVICE_S3_BUCKET
    delete process.env.FLOOD_SERVICE_CONNECTION_STRING
    delete require.cache[require.resolve('../server/config')]
  })

  lab.afterEach(() => {
    process.env.FLOOD_SERVICE_CONNECTION_STRING = connectionString
    process.env.FLOOD_SERVICE_S3_ACCESS_KEY = s3AccessKey
    process.env.FLOOD_SERVICE_S3_SECRET_ACCESS_KEY = s3SecretKey
    process.env.FLOOD_SERVICE_S3_REGION = s3Region
    process.env.FLOOD_SERVICE_S3_BUCKET = s3Bucket
    delete require.cache[require.resolve('../server/config')]
  })

  lab.test('Check bad config fails', () => {
    Code.expect(() => { require('../server/config') }).to.throw()
  })

  lab.test('Config should accept empty S3 credentials for IAM role fallback', () => {
    process.env.FLOOD_SERVICE_CONNECTION_STRING = 'postgresql://user:pass@host:5432/db'
    process.env.FLOOD_SERVICE_S3_ACCESS_KEY = ''
    process.env.FLOOD_SERVICE_S3_SECRET_ACCESS_KEY = ''
    process.env.FLOOD_SERVICE_S3_REGION = 'eu-west-2'
    process.env.FLOOD_SERVICE_S3_BUCKET = 'test-bucket'

    const config = require('../server/config')
    Code.expect(config.s3.accessKey).to.equal('')
    Code.expect(config.s3.secretAccessKey).to.equal('')
    Code.expect(config.s3.region).to.equal('eu-west-2')
    Code.expect(config.s3.bucket).to.equal('test-bucket')
  })

  lab.test('Config should accept undefined S3 credentials for IAM role fallback', () => {
    process.env.FLOOD_SERVICE_CONNECTION_STRING = 'postgresql://user:pass@host:5432/db'
    delete process.env.FLOOD_SERVICE_S3_ACCESS_KEY
    delete process.env.FLOOD_SERVICE_S3_SECRET_ACCESS_KEY
    process.env.FLOOD_SERVICE_S3_REGION = 'eu-west-2'
    process.env.FLOOD_SERVICE_S3_BUCKET = 'test-bucket'

    const config = require('../server/config')
    Code.expect(config.s3.accessKey).to.be.undefined()
    Code.expect(config.s3.secretAccessKey).to.be.undefined()
    Code.expect(config.s3.region).to.equal('eu-west-2')
    Code.expect(config.s3.bucket).to.equal('test-bucket')
  })

  lab.test('Config should accept valid S3 credentials', () => {
    process.env.FLOOD_SERVICE_CONNECTION_STRING = 'postgresql://user:pass@host:5432/db'
    process.env.FLOOD_SERVICE_S3_ACCESS_KEY = 'test-key'
    process.env.FLOOD_SERVICE_S3_SECRET_ACCESS_KEY = 'test-secret'
    process.env.FLOOD_SERVICE_S3_REGION = 'eu-west-2'
    process.env.FLOOD_SERVICE_S3_BUCKET = 'test-bucket'

    const config = require('../server/config')
    Code.expect(config.s3.accessKey).to.equal('test-key')
    Code.expect(config.s3.secretAccessKey).to.equal('test-secret')
    Code.expect(config.s3.region).to.equal('eu-west-2')
    Code.expect(config.s3.bucket).to.equal('test-bucket')
  })

  lab.test('Config should fail when S3 region is missing', () => {
    process.env.FLOOD_SERVICE_CONNECTION_STRING = 'postgresql://user:pass@host:5432/db'
    process.env.FLOOD_SERVICE_S3_ACCESS_KEY = 'test-key'
    process.env.FLOOD_SERVICE_S3_SECRET_ACCESS_KEY = 'test-secret'
    delete process.env.FLOOD_SERVICE_S3_REGION
    process.env.FLOOD_SERVICE_S3_BUCKET = 'test-bucket'

    Code.expect(() => { require('../server/config') }).to.throw()
  })

  lab.test('Config should fail when S3 bucket is missing', () => {
    process.env.FLOOD_SERVICE_CONNECTION_STRING = 'postgresql://user:pass@host:5432/db'
    process.env.FLOOD_SERVICE_S3_ACCESS_KEY = 'test-key'
    process.env.FLOOD_SERVICE_S3_SECRET_ACCESS_KEY = 'test-secret'
    process.env.FLOOD_SERVICE_S3_REGION = 'eu-west-2'
    delete process.env.FLOOD_SERVICE_S3_BUCKET

    Code.expect(() => { require('../server/config') }).to.throw()
  })
})
