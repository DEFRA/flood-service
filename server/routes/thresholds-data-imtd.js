const joi = require('@hapi/joi')
const util = require('../util')

module.exports = {
  method: 'GET',
  path: '/station/{id}/imtd/thresholds',
  handler: async request => {
    try {
      const imtdUrl = `https://imfs-prd1-thresholds-api.azurewebsites.net/Location/${request.params.id}?version=2`
      const imtdPayload = await util.getJson(imtdUrl)

      const warningThresholds = []
      const alertThresholds = []
      imtdPayload[0].TimeSeriesMetaData.forEach(element => {
        element.Thresholds.forEach(threshold => {
          if (threshold.FloodWarningArea !== null) {
            warningThresholds.push(threshold.Level)
          }
          if (threshold.ThresholdType === 'INFO RLOI OTH') {
            alertThresholds.push(threshold.Level)
          }
        })
      })

      // Return alert and warning threshold

      return [Math.min(...warningThresholds), Math.min(...alertThresholds)]
    } catch (err) {
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
