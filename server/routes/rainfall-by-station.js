const joi = require('@hapi/joi')
const Boom = require('@hapi/boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/rainfall-station/{stationId}',
  handler: async request => {
    try {
      return await floodsService.getRainfallByStation(request.params.stationId)
    } catch (err) {
      return Boom.badRequest('Failed to get rainfall by station data', err)
    }
  },
  options: {
    description: 'Get rainfall by station',
    validate: {
      params: joi.object({
        stationId: joi.string().required()
      })
    }
  }
}
