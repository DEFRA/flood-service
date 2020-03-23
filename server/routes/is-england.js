const joi = require('@hapi/joi')
const boom = require('@hapi/boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/is-england/{x}/{y}',
  options: {
    description: 'Check if coordinates are in england',
    handler: async (request, h) => {
      try {
        return await floodsService.isEngland(request.params.x, request.params.y)
      } catch (err) {
        return boom.badRequest('Failed to get isEngland', err)
      }
    },
    validate: {
      params: joi.object({
        x: joi.number().required(),
        y: joi.number().required()
      })
    }
  }
}
