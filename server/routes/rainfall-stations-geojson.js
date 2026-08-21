const { createGeoJsonRoute } = require('./lib/utils')

module.exports = createGeoJsonRoute({
  path: '/rainfall-stations-geojson',
  serviceFunctionName: 'getRainfallStationsGeoJson',
  pagingConfigName: 'rainfallStations',
  description: 'Get rainfall monitoring stations as GeoJSON FeatureCollection',
  errorMessage: 'Failed to get rainfall stations GeoJSON'
})
