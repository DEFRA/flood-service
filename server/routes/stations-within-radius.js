const joi = require('joi')
const boom = require('boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/stations-within-radius/{lng}/{lat}/{radiusM}',
  handler: async (request, h) => {
    try {
      const { lng, lat, radiusM } = request.params
      const result = await floodsService.getStationsByRadius(lng, lat, radiusM)
      return result
    } catch (err) {
      return boom.badRequest('Failed to get stations by radius', err)
    }
  },
  options: {
    description: 'Get stations by radius',
    validate: {
      params: {
        lng: joi.number().required(),
        lat: joi.number().required(),
        radiusM: joi.number().required()
      }
    }
  }
}
