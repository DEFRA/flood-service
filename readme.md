![Build status](https://github.com/DEFRA/flood-service/actions/workflows/ci.yml/badge.svg)[![Maintainability](https://api.codeclimate.com/v1/badges/5984525ed1ab73b76869/maintainability)](https://codeclimate.com/github/DEFRA/flood-service/maintainability)[![Test Coverage](https://api.codeclimate.com/v1/badges/5984525ed1ab73b76869/test_coverage)](https://codeclimate.com/github/DEFRA/flood-service/test_coverage)

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

## Running the application

```
$ npm i
$ node index.js
```
