const joi = require('joi')
const boom = require('@hapi/boom')
const { createGeoJsonRoute } = require('./lib/utils')

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

module.exports = createGeoJsonRoute({
  path: '/flood-warning-alerts-geojson',
  serviceFunctionName: 'getFloodWarningAlertsGeoJson',
  pagingConfigName: 'floodWarningAlerts',
  description: 'Get flood warning/alert areas as GeoJSON FeatureCollection',
  errorMessage: 'Failed to get flood warning alerts GeoJSON',
  extraQuerySchema: { bbox: joi.string().required() },
  getQueryParams: getBboxParams
})
