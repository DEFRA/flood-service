// const joi = require('@hapi/joi')
const boom = require('@hapi/boom')
const services = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/rivers',
  handler: (request, h) => {
    try {
      return services.getRivers()
    } catch (err) {
      return boom.badRequest('Failed to get rivers', err)
    }
  },
  options: {
    description: 'Get rivers'
  }
}
