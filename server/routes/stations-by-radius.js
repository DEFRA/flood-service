const joi = require('@hapi/joi')
const boom = require('@hapi/boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/stations-by-radius/{x}/{y}',
  handler: async request => {
    try {
      return await floodsService.getStationsByRadius(request.params.x, request.params.y)
    } catch (err) {
      return boom.badRequest('Failed to get stations search', err)
    }
  },
  options: {
    description: 'Get stations within 8km',
    validate: {
      params: joi.object({
        x: joi.number().required(),
        y: joi.number().required()
      })
    }
  }
}
