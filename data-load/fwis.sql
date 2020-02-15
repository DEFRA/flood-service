-- SEQUENCE: u_flood.fwis_id_seq

-- DROP SEQUENCE u_flood.fwis_id_seq;

CREATE SEQUENCE u_flood.fwis_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE u_flood.fwis_id_seq
    OWNER TO u_flood;

-- Table: u_flood.fwis

-- DROP TABLE u_flood.fwis;

CREATE TABLE u_flood.fwis
(
    id bigint NOT NULL DEFAULT nextval('fwis_id_seq'::regclass),
	situation text,
	ta_id integer,
	ta_code character varying(200),
	ta_name text,
	ta_description text,
	quick_dial integer,
	ta_version integer,
	ta_category character varying(200),
	owner_area character varying(200),
	ta_created_date timestamp with time zone,
	ta_modified_date timestamp with time zone,
	situation_changed timestamp with time zone,
	severity_changed timestamp with time zone,
	message_received timestamp with time zone,
	severity_value integer,
	severity character varying(200),
	CONSTRAINT fwis_pkey PRIMARY KEY (id)
        USING INDEX TABLESPACE flood_indexes
)
WITH (
    OIDS = FALSE
)
TABLESPACE flood_tables;

ALTER TABLE u_flood.fwis
    OWNER to u_flood;

-- Index: idx_fwis_fwa_code

-- DROP INDEX u_flood.idx_fwis_fwa_code;

CREATE INDEX idx_fwis_fwa_code
    ON u_flood.fwis USING btree
    (ta_code COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE flood_indexes;

