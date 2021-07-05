module.exports = {
  plugin: {
    name: 'on-pre-response',
    register: server => {
      server.ext('onPreResponse', (request, h) => {
        const response = request.response

        if (response.isBoom) {
          request.log('error', {
            statusCode: response.output.statusCode,
            data: response.data,
            situation: response.message
          })
        }

        return h.continue
      })
    }
  }
}
