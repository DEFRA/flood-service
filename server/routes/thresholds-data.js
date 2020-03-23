const joi = require('@hapi/joi')
const boom = require('@hapi/boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/station/{id}/forecast/thresholds',
  handler: async (request, h) => {
    try {
      return await floodsService.getFFOIThresholds(request.params.id)
    } catch (err) {
      return boom.badRequest('Failed to get ffoi threshold data', err)
    }
  },
  options: {
    description: 'Get forecast thresholds by station id',
    validate: {
      params: joi.object({
        id: joi.number().required()
      })
    }
  }
}
