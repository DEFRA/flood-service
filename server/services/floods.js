const boom = require('boom')
const { Pool } = require('pg')
const config = require('../config')
const pool = new Pool({
  connectionString: config.connectionString
})
const riverStations = require('./river-stations.json')
const impactData = require('./impacts.json')

const getFloods = `
  SELECT fwa_code as "code", fwa_key as "key", description,
    area_floodline_quickdial_id as "quickDialNumber",region, area, 
    flood_type as "floodType", severity, severity_description as "severityDescription", 
    warning_key as "warningKey", raised, severity_changed as "severityChanged",
    message_changed as "messageChanged", message
  FROM u_flood.current_flood_warning_alert_mview
  ORDER BY severity, description;
  SELECT load_timestamp as timestamp FROM u_flood.current_load_timestamp where id = 1;
`

const getFloodsWithin = `
  SELECT fwa_code as "code", fwa_key as "key", description,
    area_floodline_quickdial_id as "quickDialNumber",region, area, 
    flood_type as "floodType", severity, severity_description as "severityDescription", 
    warning_key as "warningKey", raised, severity_changed as "severityChanged",
    message_changed as "messageChanged", message
  FROM u_flood.current_flood_warning_alert_mview
  WHERE ST_Intersects(geom, ST_Transform(ST_Buffer(ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, 4326), 27700), 2000), 4326))
  ORDER BY severity, description;
`

const getAlertArea = `
  SELECT gid as "id", area, fws_tacode as "code", ta_name as "name",
    descrip as "description", la_name as "localAuthorityName",
    qdial as "quickDialNumber", river_sea as "riverOrSea",
    st_AsGeoJSON(geom) as geom, ST_AsGeoJSON(ST_centroid(geom)) as centroid
  FROM u_flood.flood_alert_area
  WHERE fws_tacode = $1
`
// ,
// st_AsGeoJSON(geom) as geom, ST_AsGeoJSON(ST_centroid(geom)) as centroid

const getWarningArea = `
  SELECT gid as "id", area, fws_tacode as "code", ta_name as "name",
    descrip as "description", la_name as "localAuthorityName", parent,
    qdial as "quickDialNumber", river_sea as "riverOrSea",
    st_AsGeoJSON(geom) as geom, ST_AsGeoJSON(ST_centroid(geom)) as centroid
  FROM u_flood.flood_warning_area
  WHERE fws_tacode = $1
`

const getStation = `
  SELECT *
  FROM u_flood.station_split_mview
  WHERE rloi_id = $1
  AND qualifier = $2
`

const getStationsByRadius = `
  SELECT rloi_id, telemetry_id, region, catchment, wiski_river_name,
    agency_name, external_name, station_type, status, qualifier,
    (lower(region) = 'wales' OR rloi_id IN (4162, 4170, 4173, 4174, 4176)) AS isWales 
  FROM u_flood.station_split_mview
  WHERE ST_DWithin(geography, ST_MakePoint($1, $2)::geography, $3)
    AND lower(status) != 'closed'
    AND (lower(region) != 'wales'
    OR catchment IN ('Dee', 'Severn Uplands', 'Wye'))
  ORDER BY wiski_river_name, external_name;
`

const getStationsWithin = `
  SELECT rloi_id, telemetry_id, region, catchment, wiski_river_name,
    agency_name, external_name, station_type, status, qualifier,
    (lower(region) = 'wales' OR rloi_id IN (4162, 4170, 4173, 4174, 4176)) AS isWales 
  FROM u_flood.station_split_mview
  WHERE ST_Contains(ST_Transform(ST_Buffer(ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, 4326), 27700), 2000), 4326), centroid)
    AND lower(status) != 'closed'
    AND (lower(region) != 'wales'
    OR catchment IN ('Dee', 'Severn Uplands', 'Wye'))
  ORDER BY wiski_river_name, external_name;
`

const getStationTelemetry = `
  SELECT * FROM u_flood.get_telemetry($1, $2)
`

const getFFOIForecast = `
  SELECT f.*
  FROM u_flood.ffoi_forecast f
  INNER JOIN u_flood.ffoi_station s ON f.rloi_id = s.rloi_id
  WHERE f.rloi_id = $1
  ORDER BY forecast_date DESC LIMIT 1
`
const getFFOIThresholds = `
  SELECT u_flood.ffoi_get_thresholds($1)
`
const isEngland = `
  SELECT ((SELECT count(1) FROM u_flood.england_010k e WHERE st_intersects(st_setsrid(st_makepoint($1, $2), 4326), e.geom)) > 0) AS is_england
`

// const isEnglandBbox = `
//   SELECT ((SELECT count(1) FROM u_flood.england_010k e WHERE st_intersects(ST_MakeEnvelope($1, $2, $3, $4, 4326), e.geom)) > 0) AS is_england_bbox
// `

module.exports = {
  async getFloods () {
    const result = await pool.query(getFloods)
    const floods = result[0].rows
    const timestamp = result[1].rows[0].timestamp

    return {
      floods,
      timestamp
    }
  },

  async getFloodsWithin (bbox) {
    const result = await pool.query(getFloodsWithin, bbox)
    const floods = result.rows

    return { floods }
  },

  async getAlertArea (code) {
    const result = await pool.query(getAlertArea, [code])
    const [area] = result.rows

    return area
  },

  async getWarningArea (code) {
    const result = await pool.query(getWarningArea, [code])
    const [area] = result.rows

    return area
  },

  async getStation (id, direction) {
    const result = await pool.query(getStation, [id, direction])
    const [station] = result.rows

    return station
  },

  async getStationsWithin (bbox) {
    const result = await pool.query(getStationsWithin, bbox)
    const stations = result.rows

    return stations
  },

  async getStationsUpstreamDownstream (id) {
    // TODO: refactor to make truly asynchronous
    //
    try {
      let station = riverStations.find(station => station.id === 'stations.' + id)
      return station
    } catch (err) {
      return boom.badRequest('Failed to get river stations ', err)
    }
  },

  async getStationsByRadius (lng, lat, radiusM) {
    const result = await pool.query(getStationsByRadius, [lng, lat, radiusM])
    const stations = result.rows

    return stations
  },

  async getStationTelemetry (id, direction) {
    const result = await pool.query(getStationTelemetry, [id, direction])
    const [{ get_telemetry: telemetry }] = result.rows

    return telemetry
  },

  async getFFOIThresholds (id) {
    const result = await pool.query(getFFOIThresholds, [id])
    const [{ ffoi_get_thresholds: thresholds }] = result.rows

    return thresholds
  },

  async getFFOIForecast (id) {
    const result = await pool.query(getFFOIForecast, [id])
    const [area] = result.rows

    return area
  },

  async isEngland (x, y) {
    const result = await pool.query(isEngland, [x, y])
    const [value] = result.rows

    return value
  },

  async getImpactData (id) {
    try {
      let impacts = impactData.filter(impacts => parseInt(impacts.rloiId) === id)
      if (!impacts) {
        console.log('No impacts for id: ', id)
        return []
      }
      return impacts
    } catch (err) {
      return boom.badRequest('Failed to get impact data ', err)
    }
  },

  async getImpactDataWithin (bbox) {
    try {
      let impact = impactData.filter(impact =>
        parseFloat(impact.longtitude) <= bbox[0] &&
        parseFloat(impact.longtitude) >= bbox[2] &&
        parseFloat(impact.latitude) >= bbox[3] &&
        parseFloat(impact.latitude) <= bbox[1]
      )
      if (!impact) {
        console.log('No impacts available within bbox: ', bbox)
        return []
      }
      return impact
    } catch (err) {
      return boom.badRequest('Failed to get impact data ', err)
    }
  }
}
