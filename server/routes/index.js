module.exports = {
  method: 'GET',
  path: '/',
  handler: (_request, h) => h.response('').code(200),
  options: {
    description: 'Service health check endpoint'
  }
}
