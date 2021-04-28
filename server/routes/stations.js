const boom = require('@hapi/boom')
const floodsService = require('../services')

module.exports = {
  method: 'GET',
  path: '/stations',
  handler: async () => {
    try {
      return await floodsService.getStations()
    } catch (err) {
      return boom.badRequest('Failed to get stations data', err)
    }
  },
  options: {
    description: 'Get all stations'
  }
}
