const joi = require('joi')
const boom = require('@hapi/boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/flood-area/warning/{code}',
  handler: async (request, h) => {
    try {
      const { code } = request.params
      const area = await floodsService.getWarningArea(code)

      return area || boom.notFound(`Warning area ${code}`)
    } catch (err) {
      return boom.badRequest('Failed to get warning area', err)
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
