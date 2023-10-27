'use strict'

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

        if (statusCode >= 400 && statusCode !== 404) {
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
