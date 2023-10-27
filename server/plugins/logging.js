'use strict'
const pino = require('../lib/logging/pino')

module.exports = {
  plugin: require('hapi-pino'),
  options: {
    logEvents: ['onPostStart', 'onPostStop'],
    instance: pino,
    wrapSerializers: false,
    serializers: {
      req: req => ({
        method: req.method.toUpperCase(),
        url: req.url.pathname,
        query: Object.keys(req.query || {}).length ? req.query : undefined
      }),
      res: res => ({
        statusCode: res?.output?.statusCode
      }),
      err: ({ name, message, stack, code }) => ({
        name,
        code,
        message,
        stack
      })
    }
  }
}
