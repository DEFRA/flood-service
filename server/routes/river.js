const joi = require('@hapi/joi')
const boom = require('@hapi/boom')
const services = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/river/{riverId}',
  handler: async request => {
    try {
      const data = await services.getRiverStationsByRiverId(request.params.riverId)
      return data
    } catch (err) {
      return boom.badRequest('Failed to get stations by river', err)
    }
  },
  options: {
    description: 'Get stations by river name',
    validate: {
      params: joi.object({
        riverId: joi.string().required()
      })
    }
  }
}
