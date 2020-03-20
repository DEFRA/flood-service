const floodsService = require('../services')
const boom = require('@hapi/boom')

module.exports = {
  method: 'GET',
  path: '/ffoi-health',
  handler: async (request, h) => {
    try {
      const result = await floodsService.getFfoiHealth()
      return result
    } catch (err) {
      return boom.badRequest('Failed to get ffoi health', err)
    }
  }
}
