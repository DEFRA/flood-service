const joi = require('@hapi/joi')
const boom = require('@hapi/boom')
const s3Service = require('../services/s3')

module.exports = {
  method: 'GET',
  path: '/station/{telemetryId}/forecast/data',
  handler: async request => {
    try {
      throw new Error('test')
      return await s3Service.ffoi(request.params.telemetryId)
    } catch (err) {
      return boom.badRequest('Failed to get forecast data', err)
    }
  },
  options: {
    description: 'Get forecast by telemetry id',
    validate: {
      params: joi.object({
        telemetryId: joi.string().required()
      })
    }
  }
}
