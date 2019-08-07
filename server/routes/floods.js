const boom = require('@hapi/boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/floods',
  handler: async (request, h) => {
    try {
      const result = await floodsService.getFloods()
      return result
    } catch (err) {
      return boom.badRequest('Failed to get floods', err)
    }
  }
}
