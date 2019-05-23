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
}, {
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
}, {
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
}, {
  method: 'GET',
  path: '/stations-within/{lng}/{lat}/{radiusM}',
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
}, {
  method: 'GET',
  path: '/stations-within/{x1}/{y1}/{x2}/{y2}',
  handler: async (request, h) => {
    try {
      const { x1, y1, x2, y2 } = request.params
      const result = await floodsService.getStationsWithin([x1, y1, x2, y2])
      return result
    } catch (err) {
      return boom.badRequest('Failed to get stations search', err)
    }
  },
  options: {
    description: 'Get stations with bbox',
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
  path: '/impacts/{id}',
  handler: async (request, h) => {
    try {
      const { id } = request.params
      const impacts = await floodsService.getImpactData(id)
      // // const stationData = await floodsService.getStation(id, direction)
      // const stationData = {}
      // stationData.impacts = impacts
      // return stationData
      // console.log(impacts)
      return impacts
    } catch (err) {
      return boom.badRequest('Failed to get impact data', err)
    }
  },
  options: {
    description: 'Get impact data',
    validate: {
      params: {
        id: joi.number().required()
      }
    }
  }
}, {
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
}, {
  method: 'GET',
  path: '/station/{id}/{direction}/telemetry',
  handler: async (request, h) => {
    try {
      const { id, direction } = request.params
      const result = await floodsService.getStationTelemetry(id, direction)
      return result
    } catch (err) {
      return boom.badRequest('Failed to get telemetry data', err)
    }
  },
  options: {
    description: 'Get telemetry by station id',
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
  handler: async (request, h) => {
    try {
      const { id } = request.params
      const result = await s3Service.ffoi(id)
      return result
    } catch (err) {
      return boom.badRequest('Failed to get forecast data', err)
    }
  },
  options: {
    description: 'Get forecast by station id',
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
}, {
  method: 'GET',
  path: '/outlook',
  handler: async (request, h) => {
    try {
      return new Error('Not implemented')
    } catch (err) {
      return boom.badRequest('Failed to get outlook', err)
    }
  }
}, {
  method: 'GET',
  path: '/is-england/{x}/{y}',
  options: {
    description: 'Check if coordinates are in england',
    handler: async (request, h) => {
      const params = request.params

      try {
        const result = await floodsService.isEngland(params.x, params.y)
        return result
      } catch (err) {
        return boom.badRequest('Failed to get isEngland', err)
      }
    },
    validate: {
      params: {
        x: joi.number().required(),
        y: joi.number().required()
      }
    }
  }
}]
