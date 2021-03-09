const floodsService = require('../services')
const boom = require('@hapi/boom')

module.exports = {
  method: 'GET',
  path: '/ffoi-health',
  handler: async () => {
    try {
      return await floodsService.getFfoiHealth()
    } catch (err) {
      return boom.badRequest('Failed to get ffoi health', err)
    }
  }
}
