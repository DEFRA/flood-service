const joi = require('joi')
const boom = require('boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/impacts/{id}',
  handler: async (request, h) => {
    try {
      const { id } = request.params
      const impacts = await floodsService.getImpactData(id)
      return impacts
    } catch (err) {
      return boom.badRequest('Failed to get impact data', err)
    }
  },
  options: {
    description: 'Get impact data',
    validate: {
      params: {
        id: joi.number().required()
      }
    }
  }
}
