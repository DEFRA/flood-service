module.exports = {
  method: 'GET',
  path: '/',
  handler: (request, h) => h.response('').code(200),
  options: {
    description: 'Service health check endpoint'
  }
}
