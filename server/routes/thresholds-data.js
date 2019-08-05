const joi = require('joi')
const boom = require('@hapi/boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/station/{id}/forecast/thresholds',
  handler: async (request, h) => {
    try {
      const result = await floodsService.getFFOIThresholds(request.params.id)
      return result
    } catch (err) {
      return boom.badRequest('Failed to get ffoi threshold data', err)
    }
  },
  options: {
    description: 'Get forecast thresholds by station id',
    validate: {
      params: {
        id: joi.number().required()
      }
    }
  }
}
