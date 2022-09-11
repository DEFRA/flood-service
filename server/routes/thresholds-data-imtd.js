const joi = require('@hapi/joi')
const util = require('../util')

// This module retieves station thresholds directly from the IMFS Thresholds API. This route was created for initial prototyping purposes and has been
// replaced by a new route /station/{rloi_id}/threshold.
module.exports = {
  method: 'GET',
  path: '/station/{id}/imtd/thresholds',
  handler: async request => {
    try {
      const imtdUrl = `https://imfs-prd1-thresholds-api.azurewebsites.net/Location/${request.params.id}?version=2`
      const imtdPayload = await util.getJson(imtdUrl)

      const warningAreasThresholds = []
      const alertAreasThresholds = []
      imtdPayload[0].TimeSeriesMetaData.forEach(element => {
        element.Thresholds.forEach(threshold => {
          if (threshold.ThresholdType === 'FW ACT FW' || threshold.ThresholdType === 'FW ACTCON FW' || threshold.ThresholdType === 'FW RES FW') {
            const warningAreaThreshold = {}
            warningAreaThreshold.floodWarningArea = threshold.FloodWarningArea
            warningAreaThreshold.level = threshold.Level
            warningAreasThresholds.push(warningAreaThreshold)
          }
          if (threshold.ThresholdType === 'FW ACT FAL' || threshold.ThresholdType === 'FW ACTCON FAL' || threshold.ThresholdType === 'FW RES FAL') {
            const alertAreaThreshold = {}
            alertAreaThreshold.floodWarningArea = threshold.FloodWarningArea
            alertAreaThreshold.level = threshold.Level
            alertAreasThresholds.push(alertAreaThreshold)
          }
        })
      })

      // Return alert and warning threshold

      const alertMin = Math.min(...alertAreasThresholds.map(item => item.level))
      const warningMin = Math.min(...warningAreasThresholds.map(item => item.level))

      return [warningMin, alertMin]
    } catch (err) {
      return { error: 'Failed to get IMTD threshold data' }
    }
  },
  options: {
    description: 'Get IMTD thresholds by station id',
    validate: {
      params: joi.object({
        id: joi.number().required()
      })
    }
  }
}
