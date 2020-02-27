-- View: u_flood.rivers_mview
-- select * from u_flood.rivers_mview where river_id = 'addlestone-bourne' --ST_Contains(ST_MakeEnvelope(-2.84, 52.664, -2.675, 52.77, 4326), centroid)
-- DROP MATERIALIZED VIEW u_flood.rivers_mview CASCADE;

CREATE MATERIALIZED VIEW u_flood.rivers_mview
TABLESPACE flood_tables
AS

SELECT 
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
		CASE
			WHEN rs.name is not null THEN true
			ELSE false
		END as navigable,
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
		ss.centroid,
		st_x(ss.centroid) as lon,
		st_y(ss.centroid) as lat
		FROM u_flood.station_split_mview ss 
		inner join u_flood.stations_overview_mview so on ss.rloi_id = so.rloi_id and ss.qualifier = so.direction
		left join u_flood.river_stations rs on rs.rloi_id = ss.rloi_id
		WHERE lower(ss.status) != 'closed' AND (lower(ss.region) != 'wales' OR ss.catchment IN ('Dee', 'Severn Uplands', 'Wye'))
		order by river_id, rs.rank, ss.rloi_id, ss.qualifier desc 

WITH DATA;

ALTER TABLE u_flood.rivers_mview
    OWNER TO u_flood;

-- Index: idx_rivers_mview_geom_gist

-- DROP INDEX u_flood.idx_rivers_mview_geom_gist;

CREATE INDEX idx_rivers_mview_geom_gist
    ON u_flood.rivers_mview USING gist
    (centroid)
    TABLESPACE flood_indexes;
	
-- Index: idx_rivers_mview_river_id

-- DROP INDEX u_flood.idx_rivers_mview_river_id;

CREATE INDEX idx_rivers_mview_river_id
    ON u_flood.rivers_mview USING btree
    (river_id COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE flood_indexes;

	