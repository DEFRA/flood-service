const floodsService = require('../services')
const boom = require('@hapi/boom')

module.exports = {
  method: 'GET',
  path: '/stations-health',
  handler: async (request, h) => {
    try {
      const result = await floodsService.getStationsHealth()
      return result
    } catch (err) {
      return boom.badRequest('Failed to get station health', err)
    }
  }
}
