const joi = require('joi')
const boom = require('boom')
const floodsService = require('../services')

module.exports = {
  method: 'GET',
  path: '/station/{rloiId}/{direction}',
  handler: async (request, h) => {
    try {
      const { rloiId, direction } = request.params
      const station = await floodsService.getStation(rloiId, direction)
      return station || boom.notFound(`Station ${rloiId} (${direction})`)
    } catch (err) {
      return boom.badRequest('Failed to get station data', err)
    }
  },
  options: {
    description: 'Get station by id',
    validate: {
      params: {
        rloiId: joi.number().required(),
        direction: joi.string().valid('u', 'd')
      }
    }
  }
}
