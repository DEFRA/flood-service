'use strict'
const pino = require('../lib/pino')

module.exports = {
  plugin: require('hapi-pino'),
  options: {
    logRequestComplete: false,
    instance: pino,
    serializers: {
      req: req => ({
        method: req.method.toUpperCase(),
        url: req.url,
        query: Object.keys(req.query || {}).length ? req.query : undefined
      }),
      res: res => ({
        statusCode: res.statusCode
      })
    }
  }
}
