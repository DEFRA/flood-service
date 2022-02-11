const joi = require('@hapi/joi')
const Boom = require('@hapi/boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/rainfall-station-telemetry/{stationId}',
  handler: async request => {
    try {
      return await floodsService.getRainfallStationTelemetry(request.params.stationId)
    } catch (err) {
      return Boom.badRequest('Failed to get rainfall station telemetry', err)
    }
  },
  options: {
    description: 'Get rainfall station telemetry',
    validate: {
      params: joi.object({
        stationId: joi.string().required()
      })
    }
  }
}
