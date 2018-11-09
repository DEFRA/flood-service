const joi = require('joi')
const boom = require('boom')
const floodsService = require('../services/floods')

module.exports = [{
  method: 'GET',
  path: '/floods',
  handler: async (request, h) => {
    try {
      const result = await floodsService.getFloods()
      return result
    } catch (err) {
      return boom.badRequest('Failed to get floods', err)
    }
  }
}, {
  method: 'GET',
  path: '/floods-within/{x1}/{y1}/{x2}/{y2}',
  handler: async (request, h) => {
    try {
      const { x1, y1, x2, y2 } = request.params
      const result = await floodsService.getFloodsWithin([x1, y1, x2, y2])
      return result
    } catch (err) {
      return boom.badRequest('Failed to get floods search', err)
    }
  },
  options: {
    validate: {
      params: {
        x1: joi.number().required(),
        y1: joi.number().required(),
        x2: joi.number().required(),
        y2: joi.number().required()
      }
    }
  }
}, {
  method: 'GET',
  path: '/outlook',
  handler: async (request, h) => {
    try {
      const result = await floodsService.getFloods()
      return result
    } catch (err) {
      return boom.badRequest('Failed to get outlook', err)
    }
  }
}, {
  method: 'GET',
  path: '/flood-area/alert/{code}',
  handler: async (request, h) => {
    try {
      const { code } = request.params
      const area = await floodsService.getAlertArea(code)

      if (!area) {
        return boom.notFound('Alert area')
      }

      return area
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
}, {
  method: 'GET',
  path: '/flood-area/warning/{code}',
  handler: async (request, h) => {
    try {
      const { code } = request.params
      const area = await floodsService.getWarningArea(code)

      if (!area) {
        return boom.notFound('Warning area')
      }

      return area
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
}]
