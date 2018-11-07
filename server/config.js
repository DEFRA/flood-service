const joi = require('joi')

// Define config schema
const schema = {
  port: joi.number().default(8050),
  env: joi.string().valid('development', 'test', 'production').default('development'),
  implementation: joi.string().valid('db', 'epimorphics', 'scenario1').default('db'),
  connectionString: joi.string().required()
}

// Build config
const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  connectionString: process.env.FLOOD_SERVICE_CONNECTION_STRING,
  implementation: process.env.FLOOD_SERVICE_IMPLEMENTATION
}

// Validate config
const result = joi.validate(config, schema, {
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
