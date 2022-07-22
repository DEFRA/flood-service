const joi = require('@hapi/joi')
// const boom = require('@hapi/boom')
// const floodsService = require('../services/index')
const util = require('../util')

module.exports = {
  method: 'GET',
  path: '/station/{id}/imtd/thresholds',
  handler: async request => {
    try {
      const imtdUrl = 'https://imfs-prd1-thresholds-api.azurewebsites.net/Location/' + request.params.id + '?version=2'
      const imtdPayload = await util.getJson(imtdUrl)

      const warningThresholds = []
      const alertThresholds = []
      const strippedThresholds = []
      imtdPayload[0].TimeSeriesMetaData.forEach(element => {
        element.Thresholds.forEach(threshold => {
          if (threshold.FloodWarningArea !== null) {
            warningThresholds.push(threshold.Level)
          }
          if (threshold.ThresholdType === 'INFO RLOI OTH') {
            alertThresholds.push(threshold.Level)
          }
          const fwa = {}
          fwa.type_imtd = threshold.ThresholdType
          fwa.fwis_code_imtd = threshold.FloodWarningArea
          fwa.level_imtd = threshold.Level
          strippedThresholds.push(fwa)
          // }
        })
      })

      // Create object with fwis_code and value

      // return strippedThresholds

      return [Math.min(...warningThresholds), Math.min(...alertThresholds)]
    } catch (err) {
      // return boom.badRequest('Failed to get IMTD ffoi threshold data', err)
      return { error: 'Failed to get IMTD ffoi threshold data' }
    }
  },
  options: {
    description: 'Get IMTD forecast thresholds by station id',
    validate: {
      params: joi.object({
        id: joi.number().required()
      })
    }
  }
}
