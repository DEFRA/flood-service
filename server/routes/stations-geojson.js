const joi = require('joi')
const { pagingValidationFailActionHandler, createPagedGeoJsonHandler } = require('./lib/utils')

module.exports = {
  method: 'GET',
  path: '/stations-geojson',
  handler: createPagedGeoJsonHandler({
    serviceFunctionName: 'getStationsGeoJson',
    pagingConfigName: 'stations',
    getQueryParams: () => [],
    errorMessage: 'Failed to get stations GeoJSON'
  }),
  options: {
    description: 'Get water level monitoring stations as GeoJSON FeatureCollection',
    validate: {
      query: joi.object({
        maxFeatures: joi.number().integer().min(1).optional(),
        startIndex: joi.number().integer().min(0).optional()
      }),
      failAction: pagingValidationFailActionHandler
    }
  }
}
