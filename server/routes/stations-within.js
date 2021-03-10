const joi = require('@hapi/joi')
const boom = require('@hapi/boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/stations-within/{x1}/{y1}/{x2}/{y2}',
  handler: async request => {
    try {
      const { x1, y1, x2, y2 } = request.params
      return await floodsService.getStationsWithin([x1, y1, x2, y2])
    } catch (err) {
      return boom.badRequest('Failed to get stations search', err)
    }
  },
  options: {
    description: 'Get stations with bbox',
    validate: {
      params: joi.object({
        x1: joi.number().required(),
        y1: joi.number().required(),
        x2: joi.number().required(),
        y2: joi.number().required()
      })
    }
  }
}
