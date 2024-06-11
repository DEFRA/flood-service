const joi = require('@hapi/joi')
const boom = require('@hapi/boom')
const floodsService = require('../services')

module.exports = {
  method: 'GET',
  path: '/forecast-station/{rloiId}/{direction}',
  handler: async request => {
    try {
      const { rloiId, direction } = request.params
      const station = await floodsService.getForecastFlag(rloiId, direction)
      return station || {}
    } catch (err) {
      return boom.badRequest('Failed to get station data', err)
    }
  },
  options: {
    description: 'Get forecast flag by station id',
    validate: {
      params: joi.object({
        rloiId: joi.number().required(),
        direction: joi.string().valid('u', 'd')
      })
    }
  }
}
