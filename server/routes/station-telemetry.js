const joi = require('joi')
const boom = require('@hapi/boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/station/{rloiId}/{direction}/telemetry',
  handler: async request => {
    try {
      const { rloiId, direction } = request.params
      return await floodsService.getStationTelemetry(rloiId, direction)
    } catch (err) {
      return boom.badRequest('Failed to get telemetry data', err)
    }
  },
  options: {
    description: 'Get telemetry by station id',
    validate: {
      params: joi.object({
        rloiId: joi.number().required(),
        direction: joi.string().valid('u', 'd')
      })
    }
  }
}
