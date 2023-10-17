'use strict'
const { STATUS_CODES } = require('http')

module.exports = {
  plugin: {
    name: 'on-pre-response',
    register: server => {
      server.ext('onPreResponse', (request, h) => {
        const response = request.response
        let logLevel = 'debug'
        let statusCode = response.statusCode
        let situation = statusCode && STATUS_CODES[statusCode]
        let stack

        if (response.isBoom) {
          statusCode = response.output.statusCode
          situation = response.message
          stack = response.stack
        }

        if (statusCode >= 400 && statusCode !== 404) {
          logLevel = 'error'
        }

        request.logger[logLevel]({
          statusCode,
          situation,
          stack
        })

        return h.continue
      })
    }
  }
}
