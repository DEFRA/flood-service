const joi = require('@hapi/joi')
const boom = require('@hapi/boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/target-areas-within-station-buffer/{long}/{lat}',
  handler: async (request, h) => {
    try {
      const { long, lat } = request.params
      return await floodsService.getTargetAreasWithinStationBuffer(long, lat)
    } catch (err) {
      return boom.badRequest('Failed to get target areas within buffer search', err)
    }
  },
  options: {
    description: 'Get stations within target area',
    validate: {
      params: joi.object({
        lat: joi.number().required(),
        long: joi.number().required()
      })
    }
  }
}
