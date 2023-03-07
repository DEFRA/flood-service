const joi = require('@hapi/joi')
const floodsService = require('../services/index')

function getMin (thresholds, warningType) {
  const match = (a, b) => a.toLowerCase() === b.toLowerCase()
  return Math.min(...thresholds.filter(t => match(t.fwis_type, warningType)).map(t => t.value))
}

module.exports = {
  method: 'GET',
  path: '/station/{id}/{direction}/threshold',
  handler: async request => {
    try {
      const stationThreshold = await floodsService.getStationThreshold(request.params.id, request.params.direction)
      const alertMin = getMin(stationThreshold, 'a')
      const warningMin = getMin(stationThreshold, 'w')
      return { warning: warningMin, alert: alertMin }
    } catch (err) {
      return { error: `Failed to get station threshold data: ${err}` }
    }
  },
  options: {
    description: 'Get station threshold by station id',
    validate: {
      params: joi.object({
        id: joi.number().required(),
        direction: joi.string().valid('u', 'd')
      })
    }
  }
}
