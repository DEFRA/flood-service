const boom = require('@hapi/boom')

module.exports = {
  method: 'GET',
  path: '/error',
  handler: async () => boom.badRequest('Test Error', new Error('test error'))
}
