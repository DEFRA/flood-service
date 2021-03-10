const joi = require('@hapi/joi')
const boom = require('@hapi/boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/river-station-by-station-id/{stationId}',
  handler: async request => {
    try {
      return await floodsService.getRiverStationByStationId(request.params.stationId)
    } catch (err) {
      return boom.badRequest('Failed to get River Stations', err)
    }
  },
  options: {
    description: 'Get River stations',
    validate: {
      params: joi.object({
        stationId: joi.string().required()
      })
    }
  }
}
