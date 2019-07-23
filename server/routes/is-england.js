const joi = require('joi')
const boom = require('boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/is-england/{x}/{y}',
  options: {
    description: 'Check if coordinates are in england',
    handler: async (request, h) => {
      const params = request.params

      try {
        const result = await floodsService.isEngland(params.x, params.y)
        return result
      } catch (err) {
        return boom.badRequest('Failed to get isEngland', err)
      }
    },
    validate: {
      params: {
        x: joi.number().required(),
        y: joi.number().required()
      }
    }
  }
}
