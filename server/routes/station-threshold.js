const joi = require('@hapi/joi')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/station/{id}/{direction}/threshold',
  handler: async request => {
    try {
      return await floodsService.getStationThreshold(request.params.id, request.params.direction)
    } catch (err) {
      return { error: `Failed to get station threshold data: ${err}` }
    }
  },
  options: {
    description: 'Get station threshold by station id',
    validate: {
      params: joi.object({
        id: joi.number().required(),
        direction: joi.string().valid('u', 'd')
      })
    }
  }
}
