const boom = require('@hapi/boom')
const floodsService = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/stationsGeoJson',
  handler: async () => {
    try {
      const stations = await floodsService.getStations()
      return stations
    } catch (err) {
      return boom.badRequest('Failed to get station GeoJSON', err)
    }
  }
}