[![Build Status](https://travis-ci.com/DEFRA/flood-service.svg?branch=master)](https://travis-ci.com/DEFRA/flood-service)[![Maintainability](https://api.codeclimate.com/v1/badges/5984525ed1ab73b76869/maintainability)](https://codeclimate.com/github/DEFRA/flood-service/maintainability)[![Test Coverage](https://api.codeclimate.com/v1/badges/5984525ed1ab73b76869/test_coverage)](https://codeclimate.com/github/DEFRA/flood-service/test_coverage)

# flood-service

This is the service tier node application supporting the Check for flooding service https://github.com/DEFRA/flood-app

## Environment variables

For team members these can be found in the lfwconfig repository

| name     | description      | required | default |            valid            | notes |
|----------|------------------|:--------:|---------|:---------------------------:|-------|
| NODE_ENV | Node environment |    no    |production| development,dev,test,tst,production |       |
| PORT     | Port number      |    no    | 3000    |                             |       |
| FLOOD_SERVICE_CONNECTION_STRING | PG Connection String |    yes    |         |  |       |
| FLOOD_SERVICE_S3_ACCESS_KEY     | S3 Access Key      |    yes    |     | |       |
| FLOOD_SERVICE_S3_SECRET_ACCESS_KEY | S3 Secret Key |    yes    |         |  |       |
| FLOOD_SERVICE_S3_BUCKET     | S3 Bucket      |    yes    |     ||       |
| FLOOD_SERVICE_S3_TIMEOUT     | S3 Http Timeout      |    no    | 10000 (10s)    ||       |


## Prerequisites

Local or remote Postgres/Postgis database installed from: https://github.com/DEFRA/flood-db, connection string `FLOOD_SERVICE_CONNECTION_STRING`

AWS serverless lfw-data tier processing telemetry, forecast, 5DF, fwis data and storing in the database: https://github.com/DEFRA/lfw-data

S3 Bucket storing some of the processed data files, referred to as `FLOOD_SERVICE_S3_BUCKET` in the env vars

Node v8+

## Testing the application

```
$ npm i
$ npm run test
```

## Running the application locally

```
$ npm i
$ node index.js
```

## Running the application and db in docker

# Get a backup copy of a shared database (e.g. dev or test)
`pg_dump -h {hostname} -U u_flood -d flooddev -f flooddev.sql.bak -n u_flood

Note 1: hostname would be, for example, the hostname of the dev RDS db in AWS
Note 2: the password for user u_flood is available on request

# Build flood service and populated Postgres 10.11/Postgis 2.4.4 docker image and run it
`docker-compose up --build -d`

Note 1: Postgres runs the ./setup.sql script on DB initialisation. This sets up users, schemas, etc
required by the backup script and then runs the flooddev.sql.bak SQL script.
Note 2: The service will be available on http://localhost:8050/

# Tear down app and db
`docker-compose down -v`
