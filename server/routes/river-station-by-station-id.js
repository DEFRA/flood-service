const joi = require('joi')
const boom = require('@hapi/boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/river-station-by-station-id/{stationId}/{direction}',
  handler: async request => {
    try {
      const { stationId, direction } = request.params
      return await floodsService.getRiverStationByStationId(stationId, direction)
    } catch (err) {
      return boom.badRequest('Failed to get River Stations', err)
    }
  },
  options: {
    description: 'Get River stations',
    validate: {
      params: joi.object({
        stationId: joi.string().required(),
        direction: joi.string().valid('u', 'd')
      })
    }
  }
}
