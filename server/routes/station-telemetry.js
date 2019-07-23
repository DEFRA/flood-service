const joi = require('joi')
const boom = require('boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/station/{id}/{direction}/telemetry',
  handler: async (request, h) => {
    try {
      const { id, direction } = request.params
      const result = await floodsService.getStationTelemetry(id, direction)
      return result
    } catch (err) {
      return boom.badRequest('Failed to get telemetry data', err)
    }
  },
  options: {
    description: 'Get telemetry by station id',
    validate: {
      params: {
        id: joi.number().required(),
        direction: joi.string().valid('u', 'd')
      }
    }
  }
}
