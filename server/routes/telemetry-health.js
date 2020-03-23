const floodsService = require('../services')
const boom = require('@hapi/boom')

module.exports = {
  method: 'GET',
  path: '/telemetry-health',
  handler: async (request, h) => {
    try {
      return await floodsService.getTelemetryHealth()
    } catch (err) {
      return boom.badRequest('Failed to get telemetry health', err)
    }
  }
}
