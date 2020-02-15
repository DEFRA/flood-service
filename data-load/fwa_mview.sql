-- View: u_flood.fwa_mview

-- DROP MATERIALIZED VIEW u_flood.fwa_mview;

CREATE MATERIALIZED VIEW u_flood.fwa_mview
TABLESPACE pg_default
AS
 SELECT f.*,
    faa.geom,
    st_centroid(faa.geom) AS st_centroid
   FROM u_flood.fwis AS f
   INNER JOIN u_flood.flood_alert_area AS faa ON f.ta_code::bpchar = faa.fws_tacode::bpchar
UNION
 SELECT f.*,
    fwa.geom,
    st_centroid(fwa.geom) AS st_centroid
   FROM u_flood.fwis AS f
   INNER JOIN u_flood.flood_warning_area AS fwa ON f.ta_code::bpchar = fwa.fws_tacode::bpchar
WITH DATA;

ALTER TABLE u_flood.fwa_mview
    OWNER TO u_flood;