const boom = require('boom')

module.exports = {
  method: 'GET',
  path: '/outlook',
  handler: async (request, h) => {
    try {
      return new Error('Not implemented')
    } catch (err) {
      return boom.badRequest('Failed to get outlook', err)
    }
  }
}
