-- Table: u_flood.ffoi_max

-- DROP TABLE u_flood.ffoi_max;
 
CREATE TABLE u_flood.ffoi_max
(
    telemetry_id text COLLATE pg_catalog."default" NOT NULL,
    value numeric,
    value_date timestamp with time zone,
    filename text COLLATE pg_catalog."default",
    updated_date timestamp with time zone,
    CONSTRAINT pk_ffoi_max_telemetry_id PRIMARY KEY (telemetry_id)
        USING INDEX TABLESPACE flood_indexes
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE u_flood.ffoi_max
    OWNER to u_flood;