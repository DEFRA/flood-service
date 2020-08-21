const joi = require('@hapi/joi')

const schema = joi.object({
  port: joi.number().default(8050),
  env: joi.string().valid('development', 'dev', 'test', 'tst', 'production').default('production'),
  connectionString: joi.string().required(),
  s3: joi.object().required().keys({
    accessKey: joi.string().required(),
    secretAccessKey: joi.string().required(),
    bucket: joi.string().required(),
    httpTimeoutMs: joi.number().default(10000)
  })
})

const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  connectionString: process.env.FLOOD_SERVICE_CONNECTION_STRING,
  s3: {
    accessKey: process.env.FLOOD_SERVICE_S3_ACCESS_KEY,
    secretAccessKey: process.env.FLOOD_SERVICE_S3_SECRET_ACCESS_KEY,
    bucket: process.env.FLOOD_SERVICE_S3_BUCKET,
    httpTimeoutMs: process.env.FLOOD_SERVICE_S3_TIMEOUT
  }
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

const value = result.value

value.isDev = value.env !== 'production'
value.isProd = value.env === 'production'

module.exports = value
