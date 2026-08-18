const joi = require('joi')
const { pagingValidationFailActionHandler, createPagedGeoJsonHandler } = require('./lib/utils')

module.exports = {
  method: 'GET',
  path: '/rainfall-stations-geojson',
  handler: createPagedGeoJsonHandler({
    serviceFunctionName: 'getRainfallStationsGeoJson',
    pagingConfigName: 'rainfallStations',
    getQueryParams: () => [],
    errorMessage: 'Failed to get rainfall stations GeoJSON'
  }),
  options: {
    description: 'Get rainfall monitoring stations as GeoJSON FeatureCollection',
    validate: {
      query: joi.object({
        maxFeatures: joi.number().integer().min(1).optional(),
        startIndex: joi.number().integer().min(0).optional()
      }),
      failAction: pagingValidationFailActionHandler
    }
  }
}
