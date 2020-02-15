select st_npoints(geom) from u_flood.flood_alert_area where fws_tacode = '114WAFT1W10A00'; -- 8717
select st_npoints(ST_SimplifyPreserveTopology(geom, 0.0005)) from u_flood.flood_alert_area where fws_tacode = '114WAFT1W10A00';
select st_geometrytype(ST_SimplifyPreserveTopology(geom, 0.1)) from u_flood.flood_alert_area where fws_tacode = '114WAFT1W10A00';~


update u_flood.flood_alert_area
set geom = st_multi(ST_SimplifyPreserveTopology(geom, 0.00025))

update u_flood.flood_warning_area
set geom = st_multi(ST_SimplifyPreserveTopology(geom, 0.00025))

select st_geometrytype(geom)
from u_flood.flood_alert_area

refresh materialized view u_flood.fwa_mview with data;
