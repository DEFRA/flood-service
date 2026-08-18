const joi = require('joi')
const boom = require('@hapi/boom')
const { pagingValidationFailActionHandler, createPagedGeoJsonHandler } = require('./lib/utils')

function getBboxParams (request) {
  const { bbox } = request.query

  // Parse bbox string format: "xmin,ymin,xmax,ymax,EPSG:3857"
  // Strip CRS suffix and convert to numeric array
  const bboxParts = bbox.split(',')
  if (bboxParts.length < 4) {
    throw boom.badRequest('Invalid bbox format. Expected: xmin,ymin,xmax,ymax,EPSG:3857')
  }

  const bboxParams = [
    parseFloat(bboxParts[0]),
    parseFloat(bboxParts[1]),
    parseFloat(bboxParts[2]),
    parseFloat(bboxParts[3])
  ]

  // Validate bbox coordinates are numbers
  if (bboxParams.some(coord => isNaN(coord))) {
    throw boom.badRequest('Invalid bbox coordinates. Expected numeric values')
  }

  return bboxParams
}

module.exports = {
  method: 'GET',
  path: '/flood-warning-alerts-geojson',
  handler: createPagedGeoJsonHandler({
    serviceFunctionName: 'getFloodWarningAlertsGeoJson',
    pagingConfigName: 'floodWarningAlerts',
    getQueryParams: getBboxParams,
    errorMessage: 'Failed to get flood warning alerts GeoJSON'
  }),
  options: {
    description: 'Get flood warning/alert areas as GeoJSON FeatureCollection',
    validate: {
      query: joi.object({
        bbox: joi.string().required(),
        maxFeatures: joi.number().integer().min(1).optional(),
        startIndex: joi.number().integer().min(0).optional()
      }),
      failAction: pagingValidationFailActionHandler
    }
  }
}
