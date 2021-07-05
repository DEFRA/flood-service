module.exports = {
  plugin: {
    name: 'on-pre-response',
    register: server => {
      server.ext('onPreResponse', (request, h) => {
        const response = request.response

        if (response.isBoom) {
          // gets captured in pm2 log file, details sent to error file below
          request.log('error', {
            statusCode: response.output.statusCode,
            situation: response.message
          })

          // gets captured in pm2 error file
          console.error(response)
        }

        return h.continue
      })
    }
  }
}
