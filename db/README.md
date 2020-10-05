# Backup a shared database (e.g. dev or test)
`pg_dump -h {hostname} -U u_flood -d flooddev -f flooddev.sql.bak -n u_flood

Note 1: hostname would be, for example, the hostname of the dev RDS db in AWS
Note 2: the password for user u_flood is available on request

# Build Postgres 10.11/Postgis 2.4.4 docker image and run it
`docker-compose up --build -d`

Note: Postgres runs the ./setup.sql script on DB initialisation. This sets up users, schemas, etc
required by the backup script.

# Populate local db from backup file
`psql -h localhost -p 5432 --username=rds_superuser flooddev < flooddev.sql.bak`

Note: the credentials used in the setup of rds_superuser are in the ./setup.sql file

# Run flood service against local db
`FLOOD_SERVICE_CONNECTION_STRING=postgres://u_flood:fl00d@localhost:5432/flooddev node index.js`

# Tear down restored version
`docker-compose down -v`
