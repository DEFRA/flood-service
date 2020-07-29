module.exports = [{
  method: 'GET',
  path: '/',
  handler: (request, h) => {
    return h.response('').code(200)
  },
  options: {
    description: 'Service health check endpoint'
  }
}, {
  method: 'GET',
  path: '/robots.txt',
  handler: {
    file: 'robots.txt'
  }
}]
