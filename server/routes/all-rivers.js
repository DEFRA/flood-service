const joi = require('@hapi/joi')
const boom = require('@hapi/boom')
const services = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/all-rivers/{location}',
  handler: async request => {
    try {
      return services.getRivers(request.params.location)
    } catch (err) {
      return boom.badRequest('Failed to get any Rivers', err)
    }
  },
  options: {
    description: 'Get all rivers with name',
    validate: {
      params: joi.object({
        location: joi.string().required()
      })
    }
  }
}
