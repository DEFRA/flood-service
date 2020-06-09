const joi = require('@hapi/joi')
const boom = require('@hapi/boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/stations-within-target-area/{taCode}',
  handler: async (request, h) => {
    try {
      const { taCode } = request.params
      return await floodsService.getStationsWithinTargetArea([taCode])
    } catch (err) {
      return boom.badRequest('Failed to get stations in target area search', err)
    }
  },
  options: {
    description: 'Get stations within target area',
    validate: {
      params: joi.object({
        taCode: joi.string().required()
      })
    }
  }
}
