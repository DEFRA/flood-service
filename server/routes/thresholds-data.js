const joi = require('@hapi/joi')
const boom = require('@hapi/boom')
const floodsService = require('../services/index')

const thresholdsSchema = joi.object({
  ffoi_station_threshold_id: joi.number().integer().positive().required(),
  ffoi_station_id: joi.number().integer().positive().required(),
  fwis_code: joi.string().required(),
  value: joi.number().required(),
  fwa_name: joi.string().required(),
  fwa_type: joi.string().required(),
  fwa_severity: joi.number().required()
})

module.exports = {
  method: 'GET',
  path: '/station/{id}/forecast/thresholds',
  handler: async (request, h) => {
    try {
      return await floodsService.getFFOIThresholds(request.params.id)
    } catch (err) {
      return boom.badRequest('Failed to get ffoi threshold data', err)
    }
  },
  options: {
    description: 'Get forecast thresholds by station id',
    validate: {
      params: joi.object({
        id: joi.number().required()
      })
    },
    response: {
      schema: joi.array().items(thresholdsSchema),
      failAction: 'error'
    }
  }
}
