const joi = require('joi')
const boom = require('boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/stations-upstream-downstream/{id}/{direction}',
  handler: async (request, h) => {
    try {
      const { id } = request.params
      // const { id, direction } = request.params

      const upDownData = await floodsService.getStationsUpstreamDownstream(id)
      // const stationData = await floodsService.getStation(id, direction)
      const stationData = {}
      stationData.upDown = upDownData
      return stationData
    } catch (err) {
      return boom.badRequest('Failed to get upstream - downstream stations', err)
    }
  },
  options: {
    description: 'Get upstream - downstream stations',
    validate: {
      params: {
        id: joi.string().required(),
        direction: joi.string().required()
      }
    }
  }
}
