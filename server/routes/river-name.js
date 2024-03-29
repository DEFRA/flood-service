const boom = require('@hapi/boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/river-name/{location}',
  handler: async request => {
    try {
      const { location } = request.params
      return await floodsService.getRiversByName(location)
    } catch (err) {
      return boom.badRequest('Failed to get river names', err)
    }
  },
  options: {
    description: 'Get river names'
  }
}
