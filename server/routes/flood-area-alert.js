const joi = require('joi')
const boom = require('@hapi/boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/flood-area/alert/{code}',
  handler: async (request, h) => {
    try {
      const { code } = request.params
      const area = await floodsService.getAlertArea(code)

      return area || boom.notFound(`Alert area ${code}`)
    } catch (err) {
      return boom.badRequest('Failed to get alert area', err)
    }
  },
  options: {
    validate: {
      params: {
        code: joi.string().required()
      }
    }
  }
}
