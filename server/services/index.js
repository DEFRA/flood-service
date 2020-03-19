const queries = require('./queries')
const db = require('./db')

module.exports = {
  async getFloods () {
    const result = await db.query(queries.getFloods)
    const floods = result[0].rows
    const timestamp = result[1].rows[0].timestamp

    return {
      floods,
      timestamp
    }
  },

  async getFloodsWithin (bbox) {
    const result = await db.query(queries.getFloodsWithin, bbox)
    const floods = result.rows
    return { floods }
  },

  async getAlertArea (code) {
    const result = await db.query(queries.getAlertArea, [code])
    const [area] = result.rows
    return area
  },

  async getWarningArea (code) {
    const result = await db.query(queries.getWarningArea, [code])
    const [area] = result.rows

    return area
  },

  async getStation (id, direction) {
    const result = await db.query(queries.getStation, [id, direction])
    const [station] = result.rows

    return station
  },

  async getStationsWithin (bbox) {
    const { rows } = await db.query(queries.getStationsWithin, bbox)
    return rows || []
  },

  async getRiverById (riverId) {
    const { rows } = await db.query(queries.getRiverById, [riverId])
    return rows || []
  },

  async getRiverStationByStationId (stationId) {
    const { rows } = await db.query(queries.getRiverStationByStationId, [stationId])
    return rows[0]
  },

  async getStationTelemetry (id, direction) {
    const result = await db.query(queries.getStationTelemetry, [id, direction])
    const [{ get_telemetry: telemetry }] = result.rows

    return telemetry || []
  },

  async getFFOIThresholds (id) {
    const result = await db.query(queries.getFFOIThresholds, [id])
    const [{ ffoi_get_thresholds: thresholds }] = result.rows

    return thresholds || []
  },

  async isEngland (x, y) {
    const result = await db.query(queries.isEngland, [x, y])
    const [value] = result.rows

    return value
  },

  async getImpactData (id) {
    const result = await db.query(queries.getImpactsByRloiId, [id])
    return result.rows || []
  },

  async getImpactDataWithin (bbox) {
    const result = await db.query(queries.getImpactsWithin, bbox)
    return result.rows || []
  },

  async getStationsByRiver (river) {
    const result = await db.query(queries.getStationsByRiver, [river])
    const stations = result.rows
    return stations || []
  },

  async getStationsHealth () {
    const result = await db.query(queries.getStationsHealth)
    return {
      count: parseInt(result[0].rows[0].count),
      timestamp: parseInt(result[1].rows[0].load_timestamp)
    }
  },

  async getTelemetryHealth () {
    const result = await db.query(queries.getTelemetryHealth)
    return result.rows
  }
}
