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
    const { rows: floods } = await db.query(queries.getFloodsWithin, bbox)
    return { floods }
  },

  async getAlertArea (code) {
    const { rows } = await db.query(queries.getAlertArea, [code])
    const [area] = rows
    return area
  },

  async getWarningArea (code) {
    const { rows } = await db.query(queries.getWarningArea, [code])
    const [area] = rows

    return area
  },

  async getStation (id, direction) {
    const { rows } = await db.query(queries.getStation, [id, direction])
    const [station] = rows

    return station
  },

  async getStationsWithin (bbox) {
    const { rows } = await db.query(queries.getStationsWithin, bbox)
    return rows
  },

  async getStationsWithinTargetArea (taCode) {
    const { rows } = await db.query(queries.getStationsWithinTargetArea, taCode)
    const stations = rows
    const targetArea = await this.getTargetArea(taCode)
    return { stations, targetArea }
  },

  async getTargetArea (taCode) {
    const { rows } = await db.query(queries.getTargetArea, taCode)
    const [targetArea] = rows
    return targetArea
  },

  async getWarningsAlertsWithinStationBuffer (long, lat) {
    const { rows } = await db.query(queries.getWarningsAlertsWithinStationBuffer, [long, lat])
    const warningsAlerts = rows
    return warningsAlerts
  },

  async getRiverById (riverId) {
    const { rows } = await db.query(queries.getRiverById, [riverId])
    return rows
  },

  async getRiverStationByStationId (stationId) {
    const { rows } = await db.query(queries.getRiverStationByStationId, [stationId])
    return rows[0] || {}
  },

  async getStationTelemetry (id, direction) {
    const { rows } = await db.query(queries.getStationTelemetry, [id, direction])
    const [{ get_telemetry: telemetry }] = rows

    return telemetry || []
  },

  async getFFOIThresholds (id) {
    const { rows } = await db.query(queries.getFFOIThresholds, [id])
    const [{ ffoi_get_thresholds: thresholds }] = rows

    return thresholds || []
  },

  async isEngland (x, y) {
    const { rows } = await db.query(queries.isEngland, [x, y])
    const [value] = rows

    return value
  },

  async getImpactData (id) {
    const { rows } = await db.query(queries.getImpactsByRloiId, [id])
    return rows
  },

  async getImpactDataWithin (bbox) {
    const { rows } = await db.query(queries.getImpactsWithin, bbox)
    return rows
  },

  async getStationsHealth () {
    const result = await db.query(queries.getStationsHealth)
    return {
      count: parseInt(result[0].rows[0].count),
      timestamp: parseInt(result[1].rows[0].load_timestamp)
    }
  },

  async getTelemetryHealth () {
    const { rows } = await db.query(queries.getTelemetryHealth)
    return rows
  },

  async getFfoiHealth () {
    const { rows } = await db.query(queries.getFfoiHealth)
    return rows
  },

  async getStationsOverview () {
    const result = await db.query(queries.getStationsOverview)
    return result.rows[0].get_stations_overview || []
  }
}
