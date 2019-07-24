const joi = require('joi')
const boom = require('boom')
const floodsService = require('../services')

module.exports = {
  method: 'GET',
  path: '/station/{id}/{direction}',
  handler: async (request, h) => {
    try {
      const { id, direction } = request.params
      const station = await floodsService.getStation(id, direction)
      return station || boom.notFound(`Station ${id} (${direction})`)
    } catch (err) {
      return boom.badRequest('Failed to get station data', err)
    }
  },
  options: {
    description: 'Get station by id',
    validate: {
      params: {
        id: joi.number().required(),
        direction: joi.string().valid('u', 'd')
      }
    }
  }
}
