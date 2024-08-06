const boom = require('@hapi/boom')
const floodsService = require('../services')

module.exports = {
  method: 'GET',
  path: '/target-area/{fwisCode}/imtd-thresholds',
  handler: async request => {
    try {
      const { fwisCode } = request.params
      return await floodsService.getTargetAreaThresholds(fwisCode)
    } catch (err) {
      return boom.badRequest('Failed to get target area thresholds', err)
    }
  },
  options: {
    description: 'Get target area thresholds'
  }
}
