CREATE USER u_flood WITH PASSWORD 'fl00d';
CREATE USER rds_superuser WITH PASSWORD 'fl00d';
ALTER  USER rds_superuser WITH SUPERUSER;
CREATE USER rdsadmin WITH PASSWORD 'fl00d';
CREATE TABLESPACE flood_tables location '/data/flood_tables';
CREATE TABLESPACE flood_indexes location '/data/flood_indexes';

CREATE DATABASE flooddev WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8' OWNER = 'u_flood';
/* explicity set search path as ADD EXTENSION topology was failing with:
  ERROR:  type "geometry" does not exist */
ALTER DATABASE flooddev SET search_path=public,u_flood,postgis,topology; 

\c flooddev
/* \c flooddev rds_superuser */
/* show search_path; */

CREATE SCHEMA postgis AUTHORIZATION rds_superuser;
GRANT ALL ON SCHEMA postgis TO u_flood;
CREATE EXTENSION postgis WITH SCHEMA postgis;
CREATE SCHEMA topology AUTHORIZATION rds_superuser;
CREATE EXTENSION postgis_topology WITH SCHEMA topology;
