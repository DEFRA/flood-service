const joi = require('joi')
const boom = require('@hapi/boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/warnings-alerts-within-station-buffer/{rloiId}',
  handler: async request => {
    try {
      return await floodsService.getWarningsAlertsWithinStationBuffer(request.params.rloiId)
    } catch (err) {
      return boom.badRequest('Failed to get warnings and alerts within buffer search', err)
    }
  },
  options: {
    description: 'Get warnings and alerts within station buffer',
    validate: {
      params: joi.object({
        rloiId: joi.number().required()
      })
    }
  }
}
