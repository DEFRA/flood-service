const joi = require('joi')
const boom = require('boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/station/{id}/forecast/thresholds',
  handler: async (request, h) => {
    try {
      const { id } = request.params
      const result = await floodsService.getFFOIThresholds(id)
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
