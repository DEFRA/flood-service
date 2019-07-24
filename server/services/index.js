const boom = require('boom')
const { Pool } = require('pg')
const config = require('../config')
const riverStations = require('./river-stations.json')
const queries = require('./queries')
const pool = new Pool({
  connectionString: config.connectionString
})

module.exports = {
  async getFloods () {
    const result = await pool.query(queries.getFloods)
    const floods = result[0].rows
    const timestamp = result[1].rows[0].timestamp

    return {
      floods,
      timestamp
    }
  },

  async getFloodsWithin (bbox) {
    const result = await pool.query(queries.getFloodsWithin, bbox)
    const floods = result.rows
    return { floods }
  },

  async getAlertArea (code) {
    const result = await pool.query(queries.getAlertArea, [code])
    const [area] = result.rows

    return area
  },

  async getWarningArea (code) {
    const result = await pool.query(queries.getWarningArea, [code])
    const [area] = result.rows

    return area
  },

  async getStation (id, direction) {
    const result = await pool.query(queries.getStation, [id, direction])
    const [station] = result.rows

    return station
  },

  async getStationsWithin (bbox) {
    const result = await pool.query(queries.getStationsWithin, bbox)
    const stations = result.rows

    return stations
  },

  getStationsUpstreamDownstream (id) {
    return new Promise((resolve) => {
      resolve(riverStations.find(station => station.id === 'stations.' + id))
    })
  },

  async getStationsByRadius (lng, lat, radiusM) {
    const result = await pool.query(queries.getStationsByRadius, [lng, lat, radiusM])
    const stations = result.rows

    return stations
  },

  async getStationTelemetry (id, direction) {
    const result = await pool.query(queries.getStationTelemetry, [id, direction])
    const [{ get_telemetry: telemetry }] = result.rows

    return telemetry
  },

  async getFFOIThresholds (id) {
    const result = await pool.query(queries.getFFOIThresholds, [id])
    const [{ ffoi_get_thresholds: thresholds }] = result.rows

    return thresholds
  },

  async getFFOIForecast (id) {
    const result = await pool.query(queries.getFFOIForecast, [id])
    const [area] = result.rows

    return area
  },

  async isEngland (x, y) {
    const result = await pool.query(queries.isEngland, [x, y])
    const [value] = result.rows

    return value
  },

  async getImpactData (id) {
    try {
      const result = await pool.query(queries.getImpactsByRloiId, [id])
      return result.rows
    } catch (err) {
      return boom.badRequest('Failed to get impact data ', err)
    }
  },

  async getImpactDataWithin (bbox) {
    try {
      const result = await pool.query(queries.getImpactsWithin, bbox)
      return result.rows
    } catch (err) {
      return boom.badRequest('Failed to get impact data ', err)
    }
  }
}
