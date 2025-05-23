const { HTTP_OK } = require('../constants')

module.exports = {
  method: 'GET',
  path: '/',
  handler: (_request, h) => h.response('').code(HTTP_OK),
  options: {
    description: 'Service health check endpoint'
  }
}
