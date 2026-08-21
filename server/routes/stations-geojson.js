const { createGeoJsonRoute } = require('./lib/utils')

module.exports = createGeoJsonRoute({
  path: '/stations-geojson',
  serviceFunctionName: 'getStationsGeoJson',
  pagingConfigName: 'stations',
  description: 'Get water level monitoring stations as GeoJSON FeatureCollection',
  errorMessage: 'Failed to get stations GeoJSON'
})
