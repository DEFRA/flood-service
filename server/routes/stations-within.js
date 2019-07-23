const joi = require('joi')
const boom = require('boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/stations-within/{x1}/{y1}/{x2}/{y2}',
  handler: async (request, h) => {
    try {
      const { x1, y1, x2, y2 } = request.params
      const result = await floodsService.getStationsWithin([x1, y1, x2, y2])
      return result
    } catch (err) {
      return boom.badRequest('Failed to get stations search', err)
    }
  },
  options: {
    description: 'Get stations with bbox',
    validate: {
      params: {
        x1: joi.number().required(),
        y1: joi.number().required(),
        x2: joi.number().required(),
        y2: joi.number().required()
      }
    }
  }
}
