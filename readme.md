![Build status](https://github.com/DEFRA/flood-service/actions/workflows/ci.yml/badge.svg)[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_flood-service&metric=alert_status)](https://sonarcloud.io/dashboard?id=DEFRA_flood-service)[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_flood-service&metric=coverage)](https://sonarcloud.io/dashboard?id=DEFRA_flood-service)

# flood-service

This is the service tier node application supporting the Check for flooding service https://github.com/DEFRA/flood-app

## Environment variables

Create a .env file at the root of the project to set your environment variables locally, which is especially useful during development. The [dotenv](https://www.npmjs.com/package/dotenv) package facilitates this by automatically loading these variables at application start. This approach is recommended as a simpler alternative to global settings, like those in .bashrc. 

For DEFRA employees, these environment variables are available in our private lfwconfig repository.

| name                              | description            | required | default     | valid                               | notes |
|-----------------------------------|------------------------|:--------:|-------------|-------------------------------------|-------|
| NODE_ENV                          | Node environment       |    no    | production  | development, dev, test, tst, production |       |
| PORT                              | Port number            |    no    | 3000        |                                     |       |
| FLOOD_SERVICE_CONNECTION_STRING   | PG Connection String   |    yes   |             |                                     |       |
| FLOOD_SERVICE_S3_ACCESS_KEY       | S3 Access Key          |    yes   |             |                                     |       |
| FLOOD_SERVICE_S3_SECRET_ACCESS_KEY| S3 Secret Key          |    yes   |             |                                     |       |
| FLOOD_SERVICE_S3_BUCKET           | S3 Bucket              |    yes   |             |                                     |       |
| FLOOD_SERVICE_S3_TIMEOUT          | S3 Http Timeout        |    no    | 10000 (10s) |                                     |       |
| ERRBIT_PROJECT_KEY                | Errbit Project Key     |    no    |             |                                     |       |
| ERRBIT_ENABLED                    | Errbit Enabled         |    no    |             |                                     |       |


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
$ npm run start:local
```
