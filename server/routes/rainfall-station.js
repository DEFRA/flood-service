const joi = require('@hapi/joi')
const Boom = require('@hapi/boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/rainfall-station/{stationId}',
  handler: async request => {
    try {
      const rainfallStation = await floodsService.getRainfallStation(request.params.stationId)
      if (!rainfallStation) {
        return Boom.notFound('No rainfall station data found')
      }
      return rainfallStation
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
