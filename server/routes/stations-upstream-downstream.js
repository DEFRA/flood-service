const joi = require('@hapi/joi')
const boom = require('@hapi/boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/stations-upstream-downstream/{id}/{direction}',
  handler: async (request, h) => {
    try {
      const upDownData = await floodsService.getStationsUpstreamDownstream(request.params.id)
      return {
        upDown: upDownData
      }
    } catch (err) {
      return boom.badRequest('Failed to get upstream - downstream stations', err)
    }
  },
  options: {
    description: 'Get upstream - downstream stations',
    validate: {
      params: {
        id: joi.string().required(),
        direction: joi.string().required()
      }
    }
  }
}
