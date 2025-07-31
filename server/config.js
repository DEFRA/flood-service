const joi = require('joi')
const defaultPort = 8050

// Define config schema
const schema = joi.object({
  port: joi.number().default(defaultPort),
  env: joi.string().valid('development', 'dev', 'test', 'tst', 'production').default('production'),
  connectionString: joi.string().required(),
  s3: joi.object().required().keys({
    accessKey: joi.string().required(),
    secretAccessKey: joi.string().required(),
    region: joi.string().required(),
    bucket: joi.string().required(),
    httpTimeoutMs: joi.number().default(10000)
  }),
  logLevel: joi.string().default('info'),
  isPM2: joi.boolean().default(false),
  errbit: joi.object({
    enabled: joi.boolean().default(false),
    host: joi.string().default('https://errbit-prd.aws-int.defra.cloud'),
    projectId: joi.number().default(1),
    projectKey: joi.string()
  })
})

// Build config
const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  connectionString: process.env.FLOOD_SERVICE_CONNECTION_STRING,
  s3: {
    accessKey: process.env.FLOOD_SERVICE_S3_ACCESS_KEY,
    secretAccessKey: process.env.FLOOD_SERVICE_S3_SECRET_ACCESS_KEY,
    region: process.env.FLOOD_SERVICE_S3_REGION,
    bucket: process.env.FLOOD_SERVICE_S3_BUCKET,
    httpTimeoutMs: process.env.FLOOD_SERVICE_S3_TIMEOUT
  },
  logLevel: process.env.LOG_LEVEL,
  isPM2: !!process.env.PM2_HOME,
  errbit: {
    enabled: process.env.ERRBIT_ENABLED === 'true',
    host: process.env.ERRBIT_HOST,
    projectId: process.env.ERRBIT_PROJECT_ID,
    projectKey: process.env.ERRBIT_PROJECT_KEY
  }
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

// Use the joi validated value
const value = result.value

// Add some helper props
value.isDev = value.env !== 'production'
value.isProd = value.env === 'production'

module.exports = value
