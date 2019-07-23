const joi = require('joi')
const boom = require('boom')
const s3Service = require('../services/s3')

module.exports = {
  method: 'GET',
  path: '/station/{id}/forecast/data',
  handler: async (request, h) => {
    try {
      const { id } = request.params
      const result = await s3Service.ffoi(id)
      return result
    } catch (err) {
      return boom.badRequest('Failed to get forecast data', err)
    }
  },
  options: {
    description: 'Get forecast by station id',
    validate: {
      params: {
        id: joi.string().required()
      }
    }
  }
}
