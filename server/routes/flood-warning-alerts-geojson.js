const joi = require('joi')
const boom = require('@hapi/boom')
const { createGeoJsonRoute } = require('./lib/utils')

const BBOX_COORDINATE_COUNT = 4

function getBboxParams (request) {
  const { bbox } = request.query

  // Parse bbox string format: "xmin,ymin,xmax,ymax,EPSG:3857"
  // Strip CRS suffix and convert to numeric array
  const bboxParts = bbox.split(',')
  if (bboxParts.length < BBOX_COORDINATE_COUNT) {
    throw boom.badRequest('Invalid bbox format. Expected: xmin,ymin,xmax,ymax,EPSG:3857')
  }

  const bboxParams = bboxParts.slice(0, BBOX_COORDINATE_COUNT).map(part => parseFloat(part))

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
