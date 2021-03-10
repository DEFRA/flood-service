const floodsService = require('../services')
const boom = require('@hapi/boom')

module.exports = {
  method: 'GET',
  path: '/stations-health',
  handler: async () => {
    try {
      return await floodsService.getStationsHealth()
    } catch (err) {
      return boom.badRequest('Failed to get station health', err)
    }
  }
}
