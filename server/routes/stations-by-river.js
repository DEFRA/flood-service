const joi = require('@hapi/joi')
const boom = require('@hapi/boom')
const services = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/stations-by-river/{river}',
  handler: async (request, h) => {
    try {
      return services.getStationsByRiver(request.params.river)
    } catch (err) {
      return boom.badRequest('Failed to get stations by river', err)
    }
  },
  options: {
    description: 'Get stations by river name',
    validate: {
      params: joi.object({
        river: joi.string().required()
      })
    }
  }
}
