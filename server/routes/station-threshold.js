const joi = require('@hapi/joi')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/station/{id}/threshold',
  handler: async request => {
    try {
      const stationThreshold = await floodsService.getStationThreshold(request.params.id)
      if (stationThreshold.length > 0) {
        const warningAreasThresholds = []
        const alertAreasThresholds = []

        stationThreshold.forEach(element => {
          if (element.fwis_code.charAt(4).toLowerCase() === 'w') {
            const warningAreaThreshold = {
              floodWarningArea: element.fwis_code,
              level: element.value
            }
            warningAreasThresholds.push(warningAreaThreshold)
          } else {
            const alertAreaThreshold = {
              floodWarningArea: element.fwis_code,
              level: element.value
            }
            alertAreaThreshold.floodWarningArea = element.fwis_code
            alertAreaThreshold.level = element.value
            alertAreasThresholds.push(alertAreaThreshold)
          }
        })

        // Return alert and warning threshold

        const alertMin = Math.min(...alertAreasThresholds.map(item => item.level))
        const warningMin = Math.min(...warningAreasThresholds.map(item => item.level))

        return [warningMin, alertMin]
      } else {
        return [null, null]
      }
    } catch (err) {
      return { error: `Failed to get station threshold data: ${err}` }
    }
  },
  options: {
    description: 'Get station threshold by station id',
    validate: {
      params: joi.object({
        id: joi.number().required()
      })
    }
  }
}
