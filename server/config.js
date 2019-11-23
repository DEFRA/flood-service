const joi = require('@hapi/joi')

// Define config schema
const schema = joi.object({
  port: joi.number().default(8050),
  env: joi.string().valid('development', 'test', 'production').default('development'),
  connectionString: joi.string().required(),
  s3: joi.object().required().keys({
    accessKey: joi.string().required(),
    secretAccessKey: joi.string().required(),
    bucket: joi.string().required(),
    key: joi.string().required(),
    httpProxy: joi.string().uri(),
    httpTimeoutMs: joi.number().default(10000)
  }),
  errbit: joi.object().required().keys({
    postErrors: joi.boolean().default(false),
    options: joi.object().required().keys({
      env: joi.string(),
      key: joi.string(),
      host: joi.string(),
      proxy: joi.string()
    })
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
    bucket: process.env.FLOOD_SERVICE_S3_BUCKET,
    key: process.env.FLOOD_SERVICE_S3_KEY,
    httpProxy: process.env.FLOOD_SERVICE_S3_PROXY,
    httpTimeoutMs: process.env.FLOOD_SERVICE_S3_TIMEOUT
  },
  errbit: {
    postErrors: process.env.FLOOD_SERVICE_ERRBIT_POST_ERRORS,
    options: {
      env: process.env.FLOOD_SERVICE_ERRBIT_ENV,
      key: process.env.FLOOD_SERVICE_ERRBIT_KEY,
      host: process.env.FLOOD_SERVICE_ERRBIT_HOST,
      proxy: process.env.FLOOD_SERVICE_ERRBIT_PROXY
    }
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
value.isDev = value.env === 'development'
value.isProd = value.env === 'production'

module.exports = value
