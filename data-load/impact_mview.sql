-- View: u_flood.impact_mview

DROP MATERIALIZED VIEW u_flood.impact_mview;

CREATE MATERIALIZED VIEW u_flood.impact_mview
TABLESPACE flood_tables
AS

select i.id as impactid,
tc.wiski_river_name || ' at ' || tc.agency_name as gauge,
i.rloi_id as rloiid,
i.value,
i.units,
i.geom,
st_asgeojson(i.geom) as coordinates,
i.comment,
i.short_name as shortname,
i.description,
i.type,
i.obs_flood_year as obsfloodyear,
i.obs_flood_month as obsfloodmonth,
i.source,
s.processed_value as telemetryLatest,
s.processed_value >= i.value as telemetryActive,
ffoi.value as forecastMax,
(ffoi.value >= i.value AND fs.rloi_id is not null) as forecastActive
from u_flood.impact i
inner join u_flood.telemetry_context tc on i.rloi_id = tc.rloi_id
left join u_flood.stations_overview_mview s on s.rloi_id = i.rloi_id and s.direction = 'u'
left join u_flood.ffoi_max ffoi on ffoi.telemetry_id = s.telemetry_id
left join u_flood.ffoi_station fs on i.rloi_id = fs.rloi_id

WITH DATA;

ALTER TABLE u_flood.impact_mview
    OWNER TO u_flood;
