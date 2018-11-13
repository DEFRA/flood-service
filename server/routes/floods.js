const joi = require('joi')
const boom = require('boom')
const floodsService = require('../services/floods')
const s3Service = require('../services/s3')

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
}, {
  method: 'GET',
  path: '/station/{id}/{direction}',
  handler: async (request, h) => {
    try {
      const { id, direction } = request.params
      const result = await floodsService.getStation(id, direction)
      return result
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
}, {
  method: 'GET',
  path: '/station/{id}/{direction}/telemetry',
  options: {
    description: 'Get telemetry by station id',
    handler: async (request, h) => {
      try {
        const { id, direction } = request.params
        const result = await floodsService.getStationTelemetry(id, direction)
        return result
      } catch (err) {
        return boom.badRequest('Failed to get telemetry data', err)
      }
    },
    validate: {
      params: {
        id: joi.number().required(),
        direction: joi.string().valid('u', 'd')
      }
    }
  }
}, {
  method: 'GET',
  path: '/station/{id}/forecast/data',
  options: {
    description: 'Get forecast by station id',
    handler: async (request, h) => {
      try {
        const { id } = request.params
        const result = await s3Service.ffoi(id)
        return result
      } catch (err) {
        return boom.badRequest('Failed to get forecast data', err)
      }
    },
    validate: {
      params: {
        id: joi.string().required()
      }
    }
  }
}, {
  method: 'GET',
  path: '/station/{id}/forecast/thresholds',
  handler: async (request, h) => {
    try {
      const { id } = request.params
      const result = await floodsService.getFFOIThresholds(id)
      return result
    } catch (err) {
      return boom.badRequest('Failed to get ffoi threshold data', err)
    }
  },
  options: {
    description: 'Get forecast thresholds by station id',
    validate: {
      params: {
        id: joi.number().required()
      }
    }
  }
}]
