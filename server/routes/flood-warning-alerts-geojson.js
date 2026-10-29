const joi = require('joi')
const boom = require('@hapi/boom')
const { createGeoJsonRoute } = require('./lib/utils')

const BBOX_COORDINATE_COUNT = 4
const BBOX_CRS_SUFFIX = 'EPSG:3857'
const BBOX_PART_COUNT = BBOX_COORDINATE_COUNT + 1

// Matches a complete signed integer or decimal number only - rejects partial parses
// (e.g. "1x"), exponential notation, and non-finite literals (e.g. "Infinity") that
// Number.parseFloat/Number would otherwise silently accept
const NUMERIC_COORDINATE_PATTERN = /^-?\d+(\.\d+)?$/

function getBboxParams (request) {
  const { bbox } = request.query

  // Parse bbox string format: "xmin,ymin,xmax,ymax,EPSG:3857"
  const bboxParts = bbox.split(',')
  if (bboxParts.length !== BBOX_PART_COUNT || bboxParts[BBOX_COORDINATE_COUNT] !== BBOX_CRS_SUFFIX) {
    throw boom.badRequest(`Invalid bbox format. Expected: xmin,ymin,xmax,ymax,${BBOX_CRS_SUFFIX}`)
  }

  const coordinateParts = bboxParts.slice(0, BBOX_COORDINATE_COUNT)
  if (coordinateParts.some(part => !NUMERIC_COORDINATE_PATTERN.test(part))) {
    throw boom.badRequest('Invalid bbox coordinates. Expected numeric values')
  }

  const coordinates = coordinateParts.map(Number)

  // Number() overflows to Infinity for an overlong all-digit string that still
  // passes NUMERIC_COORDINATE_PATTERN, so a finiteness check is needed after conversion
  if (coordinates.some(coord => !Number.isFinite(coord))) {
    throw boom.badRequest('Invalid bbox coordinates. Expected finite numeric values')
  }

  const [xmin, ymin, xmax, ymax] = coordinates

  if (xmin >= xmax || ymin >= ymax) {
    throw boom.badRequest('Invalid bbox coordinates. Expected xmin < xmax and ymin < ymax')
  }

  return [xmin, ymin, xmax, ymax]
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
