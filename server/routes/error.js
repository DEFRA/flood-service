const boom = require('@hapi/boom')

module.exports = {
  method: 'GET',
  path: '/error',
  handler: async () => {
    return boom.badRequest('Test Error', new Error('test error'))
  }
}
