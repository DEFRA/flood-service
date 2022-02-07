const joi = require('@hapi/joi')
const Boom = require('@hapi/boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/rainfall-station-totals/{stationId}',
  handler: async request => {
    try {
      return await floodsService.getRainfallStationTotals(request.params.stationId)
    } catch (err) {
      return Boom.badRequest('Failed to get rainfall station totals', err)
    }
  },
  options: {
    description: 'Get rainfall station totals',
    validate: {
      params: joi.object({
        stationId: joi.string().required()
      })
    }
  }
}
