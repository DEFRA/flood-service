const joi = require('@hapi/joi')
const boom = require('@hapi/boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/river-stations/{id}',
  handler: async (request, h) => {
    try {
      const stationsData = await floodsService.getStationsByRiver(request.params.id)
      return stationsData
    } catch (err) {
      return boom.badRequest('Failed to get River Stations', err)
    }
  },
  options: {
    description: 'Get River stations',
    validate: {
      params: joi.object({
        id: joi.string().required()
      })
    }
  }
}
