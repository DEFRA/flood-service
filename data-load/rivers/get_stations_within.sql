-- FUNCTION: u_flood.get_stations_within(numeric, numeric, numeric, numeric)
-- select u_flood.get_stations_within(-6.73, 49.36, 2.85, 55.8)

-- DROP FUNCTION u_flood.get_stations_within(numeric, numeric, numeric, numeric);

CREATE OR REPLACE FUNCTION u_flood.get_stations_within(
	_minLon numeric,
	_minLat numeric,
	_maxLon numeric,
	_maxLat numeric)
    RETURNS json
    LANGUAGE 'plpgsql'
AS $BODY$
declare result json;
begin
	select json_agg(res) 
	from
		(SELECT 
		CASE
			WHEN rs.id is not null THEN rs.id
			ELSE CASE
					WHEN ss.station_type = 'C' THEN 'Sea Levels'
					WHEN ss.station_type = 'G' THEN 'Groundwater Levels'
					ELSE 'orphaned-' || ss.wiski_river_name
				END
		END as river_id,
		CASE
			WHEN rs.name is not null THEN rs.name
			ELSE CASE
					WHEN ss.station_type = 'C' THEN 'Sea Levels'
					WHEN ss.station_type = 'G' THEN 'Groundwater Levels'
					ELSE 'orphaned-' || ss.wiski_river_name
				END
		END as river_name,
		rs.rank,
		ss.rloi_id, 
		ss.telemetry_id, 
		ss.region, 
		ss.catchment, 
		ss.wiski_river_name, 
		ss.agency_name, 
		ss.external_name, 
		ss.station_type, 
		ss.status, 
		ss.qualifier, 
		(lower(ss.region) = 'wales' OR ss.rloi_id IN (4162, 4170, 4173, 4174, 4176)) AS isWales, 
		so.processed_value as value, 
		so.value_timestamp, 
		so.error as value_erred, 
		so.percentile_5, 
		so.percentile_95, 
		st_asgeojson(centroid) as geometry 
		FROM u_flood.station_split_mview ss 
		inner join u_flood.stations_overview_mview so on ss.rloi_id = so.rloi_id and ss.qualifier = so.direction
		left join u_flood.river_stations rs on rs.rloi_id = ss.rloi_id
		WHERE ST_Contains(ST_MakeEnvelope(_minLon, _minLat, _maxLon, _maxLat, 4326), ss.centroid)AND 
		lower(ss.status) != 'closed' AND (lower(ss.region) != 'wales' OR ss.catchment IN ('Dee', 'Severn Uplands', 'Wye'))
		order by river_id, rs.rank, ss.rloi_id, ss.qualifier desc 

	 ) as res into result;

	return result;
end;
$BODY$;

ALTER FUNCTION u_flood.get_stations_within(numeric, numeric, numeric, numeric)
    OWNER TO u_flood;
