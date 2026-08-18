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
  async getForecastFlag (id, direction) {
    const { rows } = await db.query('getForecastFlag', [id, direction])
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
    const { rows: [rainfallStation] } = await db.query('getRainfallStation', [stationId])
    return rainfallStation
  },

  async getRiverStationByStationId (stationId, direction) {
    const { rows } = await db.query('getRiverStationByStationId', [stationId, direction])
    return rows[0] || {}
  },

  async getStationTelemetry (id, direction) {
    const { rows } = await db.query('getStationTelemetry', [id, direction])
    const [{ get_telemetry: telemetry }] = rows

    return telemetry || []
  },

  async getStationImtdThresholds (id, direction) {
    const { rows } = await db.query('getStationImtdThresholds', [id, direction])
    return rows
  },

  async getTargetAreaThresholds (id) {
    const { rows } = await db.query('getTargetAreaThresholds', [id])
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
  },

  // Helper function to convert database rows to GeoJSON FeatureCollection with WFS metadata
  // Handles geometry parsing, feature building, paging, and COUNT query execution
  // featureBuilder config object should have: getId(row), geometryName, getProperties(row)
  async rowsToGeoJsonFeatureCollection (queryName, queryParams, featureBuilder, pagingOptions, countQueryName) {
    // Append paging values to query params if provided
    const fullParams = pagingOptions ? [...queryParams, pagingOptions.limit, pagingOptions.offset] : queryParams

    // Execute main GeoJSON query
    const { rows } = await db.query(queryName, fullParams)

    // Parse geometry from each row (ST_AsGeoJSON returns JSON string, not object)
    const features = rows.map(row => {
      const geometry = JSON.parse(row.geom)
      return {
        type: 'Feature',
        id: featureBuilder.getId(row),
        geometry,
        geometry_name: featureBuilder.geometryName,
        properties: featureBuilder.getProperties(row)
      }
    })

    // If paging requested, execute COUNT query to get total features before pagination
    let numberMatched = features.length
    const shouldRunCountQuery = pagingOptions !== undefined && countQueryName !== undefined
    if (shouldRunCountQuery) {
      const countResult = await db.query(countQueryName, queryParams)
      numberMatched = parseInt(countResult.rows[0].count, 10)
    }

    const timeStamp = new Date().toISOString()
    const numberReturned = features.length

    return {
      type: 'FeatureCollection',
      features,
      totalFeatures: numberMatched,
      numberMatched,
      numberReturned,
      timeStamp,
      crs: {
        type: 'name',
        properties: {
          name: 'urn:ogc:def:crs:EPSG::4326'
        }
      }
    }
  },

  // GET /stations-geojson - Water level monitoring stations with optional paging
  // Includes upstream/downstream directions where applicable
  async getStationsGeoJson (queryParams, pagingOptions) {
    return this.rowsToGeoJsonFeatureCollection(
      'getStationsGeoJson',
      queryParams,
      {
        getId: row => {
          // GeoServer returns concatenated rloi_id for downstream: "9575/downstream"
          // For upstream or unmarked, use just the rloi_id as string
          return `stations.${row.rloi_id}`
        },
        geometryName: 'centroid',
        getProperties: row => ({
          direction: row.direction,
          type: row.type,
          iswales: row.iswales,
          atrisk: row.atrisk,
          status: row.status,
          name: row.name,
          river: row.river,
          value: row.value,
          value_date: row.value_date,
          trend: row.trend,
          percentile_5: row.percentile_5,
          percentile_95: row.percentile_95,
          is_ffoi: row.is_ffoi,
          is_ffoi_at_risk: row.is_ffoi_at_risk,
          ffoi_max: row.ffoi_max,
          ffoi_date: row.ffoi_date,
          up: row.up,
          down: row.down,
          river_name: row.river_name,
          up_station_type: row.up_station_type,
          down_station_type: row.down_station_type,
          base_rloi_id: row.base_rloi_id
        })
      },
      pagingOptions,
      'getStationsGeoJsonCount'
    )
  },

  // GET /rainfall-stations-geojson - Rainfall monitoring stations with optional paging
  // Returns all rainfall stations excluding Wales region
  async getRainfallStationsGeoJson (queryParams, pagingOptions) {
    return this.rowsToGeoJsonFeatureCollection(
      'getRainfallStationsGeoJson',
      queryParams,
      {
        getId: row => `rainfall_stations.${row.station_reference}.${row.region}`,
        geometryName: 'centroid',
        getProperties: row => ({
          telemetry_station_id: row.telemetry_station_id,
          station_name: row.station_name,
          ngr: row.ngr,
          easting: row.easting,
          northing: row.northing,
          data_type: row.data_type,
          period: row.period,
          units: row.units,
          telemetry_value_parent_id: row.telemetry_value_parent_id,
          value: row.value,
          value_timestamp: row.value_timestamp,
          day_total: row.day_total,
          six_hr_total: row.six_hr_total,
          one_hr_total: row.one_hr_total,
          type: row.type,
          region: row.region,
          station_reference: row.station_reference
        })
      },
      pagingOptions,
      'getRainfallStationsGeoJsonCount'
    )
  },

  // GET /flood-warning-alerts-geojson?bbox=... - Flood warning/alert areas with optional bbox and paging
  // bbox format: xmin,ymin,xmax,ymax in EPSG:3857 (Web Mercator)
  async getFloodWarningAlertsGeoJson (bboxParams, pagingOptions) {
    return this.rowsToGeoJsonFeatureCollection(
      'getFloodWarningAlertsGeoJson',
      bboxParams,
      {
        getId: row => `flood_warning_alert.${row.ta_code}`,
        geometryName: 'geom',
        getProperties: row => ({
          id: row.id,
          ta_code: row.ta_code,
          taCode: row.taCode,
          ta_name: row.ta_name,
          severity_value: row.severity_value,
          severity: row.severity
        })
      },
      pagingOptions,
      'getFloodWarningAlertsGeoJsonCount'
    )
  }
}
