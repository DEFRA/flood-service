const joi = require('joi')
const boom = require('@hapi/boom')
const floodsService = require('../services/index')
const eightKRadius = 8000

module.exports = {
  method: 'GET',
  path: '/stations-by-radius/{x}/{y}/{rad?}',
  handler: async request => {
    try {
      const radius = request.params.rad || eightKRadius
      return await floodsService.getStationsByRadius(request.params.x, request.params.y, radius)
    } catch (err) {
      return boom.badRequest('Failed to get stations search', err)
    }
  },
  options: {
    description: 'Get stations within given radius',
    validate: {
      params: joi.object({
        x: joi.number().required(),
        y: joi.number().required(),
        rad: joi.number()
      })
    }
  }
}
