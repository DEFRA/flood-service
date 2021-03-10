const joi = require('@hapi/joi')
const boom = require('@hapi/boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/impacts/{id}',
  handler: async request => {
    try {
      return await floodsService.getImpactData(request.params.id)
    } catch (err) {
      return boom.badRequest('Failed to get impact data', err)
    }
  },
  options: {
    description: 'Get impact data',
    validate: {
      params: joi.object({
        id: joi.number().required()
      })
    }
  }
}
