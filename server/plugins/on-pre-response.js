module.exports = {
  plugin: {
    name: 'on-pre-response',
    register: server => {
      server.ext('onPreResponse', (request, h) => {
        const response = request.response

        if (response.isBoom) {
          console.error(response)
        }

        return h.continue
      })
    }
  }
}
