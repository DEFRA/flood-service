'use strict'

const { HTTP_BAD_REQUEST, HTTP_NOT_FOUND } = require('../constants')

module.exports = {
  plugin: {
    name: 'on-pre-response',
    register: server => {
      server.ext('onPreResponse', (request, h) => {
        const response = request.response
        let logLevel = 'debug'
        let statusCode = response.statusCode
        let err

        if (response.isBoom) {
          statusCode = response.output.statusCode
          err = response
        }

        if (statusCode >= HTTP_BAD_REQUEST && statusCode !== HTTP_NOT_FOUND) {
          logLevel = 'error'
        }

        request.logger[logLevel]({
          res: response,
          err
        })

        return h.continue
      })
    }
  }
}
