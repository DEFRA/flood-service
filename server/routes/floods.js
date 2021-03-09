const boom = require('@hapi/boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/floods',
  handler: async () => {
    try {
      return await floodsService.getFloods()
    } catch (err) {
      return boom.badRequest('Failed to get floods', err)
    }
  }
}
