const db = require('./db')

function regexClean (string) {
  // remove brackets which were causing issues when mismatched pairings were present
  // this does not affect the results returned as brackets are treated as word boundary characters
  // and therefore the \m and \M in the query will match the same with or without them
  return string.replace(/[{}[\]()]*/g, '')
}

module.exports = {
  async getFloods () {
    const result = await db.query('getFloods')
    const floods = result[0].rows
    const timestamp = result[1].rows[0].timestamp

    return {
      floods,
      timestamp
    }
  },

  async getFloodsWithin (bbox) {
    const { rows: floods } = await db.query('getFloodsWithin', bbox)
    return { floods }
  },

  async getAlertArea (code) {
    const { rows } = await db.query('getAlertArea', [code])
    const [area] = rows
    return area
  },

  async getWarningArea (code) {
    const { rows } = await db.query('getWarningArea', [code])
    const [area] = rows

    return area
  },

  async getStation (id, direction) {
    const { rows } = await db.query('getStation', [id, direction])
    const [station] = rows

    return station
  },

  async getStations () {
    const { rows } = await db.query('getStations')
    return rows
  },

  async getStationsWithin (bbox) {
    const { rows } = await db.query('getStationsWithin', bbox)
    return rows
  },

  async getStationsWithinTargetArea (taCode) {
    const { rows } = await db.query('getStationsWithinTargetArea', taCode)
    return rows
  },

  async getRiversByName (searchTerm) {
    const { rows } = await db.query('getRiversByName', [searchTerm, regexClean(searchTerm)])
    return rows
  },

  async getTargetArea (taCode) {
    const { rows } = await db.query('getTargetArea', [taCode])
    return rows[0] || {}
  },

  async getWarningsAlertsWithinStationBuffer (rloiId) {
    const { rows } = await db.query('getWarningsAlertsWithinStationBuffer', [rloiId])
    return rows
  },

  async getRiverStationsByRiverId (riverId) {
    const { rows } = await db.query('getRiverStationsByRiverId', [riverId])
    return rows
  },

  async getRainfallStationTelemetry (stationId) {
    const { rows } = await db.query('getRainfallStationTelemetry', [stationId])
    return rows
  },

  async getRainfallStation (stationId) {
    const { rows } = await db.query('getRainfallStation', [stationId])
    return rows
  },

  async getRiverStationByStationId (stationId) {
    const { rows } = await db.query('getRiverStationByStationId', [stationId])
    return rows[0] || {}
  },

  async getStationTelemetry (id, direction) {
    const { rows } = await db.query('getStationTelemetry', [id, direction])
    const [{ get_telemetry: telemetry }] = rows

    return telemetry || []
  },

  async getFFOIThresholds (id) {
    const { rows } = await db.query('getFFOIThresholds', [id])
    const [{ ffoi_get_thresholds: thresholds }] = rows

    return thresholds || []
  },

  async getStationThreshold (id) {
    const { rows } = await db.query('getStationThreshold', [id])

    return rows
  },
  
  async isEngland (x, y) {
    const { rows } = await db.query('isEngland', [x, y])
    const [value] = rows

    return value
  },

  async getImpactData (id) {
    const { rows } = await db.query('getImpactsByRloiId', [id])
    return rows
  },

  async getImpactDataWithin (bbox) {
    const { rows } = await db.query('getImpactsWithin', bbox)
    return rows
  },

  async getStationsHealth () {
    const result = await db.query('getStationsHealth')
    return {
      count: parseInt(result[0].rows[0].count),
      timestamp: parseInt(result[1].rows[0].load_timestamp)
    }
  },

  async getTelemetryHealth () {
    const { rows } = await db.query('getTelemetryHealth')
    return rows
  },

  async getFfoiHealth () {
    const { rows } = await db.query('getFfoiHealth')
    return rows
  },

  async getStationsOverview () {
    const { rows } = await db.query('getStationsOverview')
    const [{ get_stations_overview: stationsOverview }] = rows
    return stationsOverview || []
  },

  async getStationsByRadius (x, y, rad) {
    const { rows } = await db.query('getStationsByRadius', [x, y, rad])
    return rows
  }
}
