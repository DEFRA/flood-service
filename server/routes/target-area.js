const boom = require('@hapi/boom')
const floodsService = require('../services')

module.exports = {
  method: 'GET',
  path: '/target-area/{taCode}',
  handler: async request => {
    try {
      const { taCode } = request.params
      return await floodsService.getTargetArea(taCode)
    } catch (err) {
      return boom.badRequest('Failed to get target area', err)
    }
  },
  options: {
    description: 'Get target area'
  }
}
