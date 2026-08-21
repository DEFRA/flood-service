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
| FLOOD_SERVICE_S3_ACCESS_KEY       | S3 Access Key          |    yes   |             |                                     | Remove in production (uses IAM roles) |
| FLOOD_SERVICE_S3_SECRET_ACCESS_KEY| S3 Secret Key          |    yes   |             |                                     | Remove in production (uses IAM roles) |
| FLOOD_SERVICE_S3_REGION           | S3 Region              |    yes   |             | e.g. eu-west-2                      |       |
| FLOOD_SERVICE_S3_BUCKET           | S3 Bucket              |    yes   |             |                                     |       |
| FLOOD_SERVICE_S3_TIMEOUT          | S3 Http Timeout        |    no    | 10000 (10s) |                                     |       |
| FLOOD_SERVICE_STATIONS_GEOJSON_DEFAULT_START_INDEX | Default start index for `/stations-geojson` paging |    no    | 0           |                                     |       |
| FLOOD_SERVICE_STATIONS_GEOJSON_DEFAULT_MAX_FEATURES | Default max features for `/stations-geojson` paging |    no    | no limit    |                                     |       |
| FLOOD_SERVICE_RAINFALL_STATIONS_GEOJSON_DEFAULT_START_INDEX | Default start index for `/rainfall-stations-geojson` paging |    no    | 0           |                                     |       |
| FLOOD_SERVICE_RAINFALL_STATIONS_GEOJSON_DEFAULT_MAX_FEATURES | Default max features for `/rainfall-stations-geojson` paging |    no    | no limit    |                                     |       |
| FLOOD_SERVICE_FLOOD_WARNING_ALERTS_GEOJSON_DEFAULT_START_INDEX | Default start index for `/flood-warning-alerts-geojson` paging |    no    | 0           |                                     |       |
| FLOOD_SERVICE_FLOOD_WARNING_ALERTS_GEOJSON_DEFAULT_MAX_FEATURES | Default max features for `/flood-warning-alerts-geojson` paging |    no    | no limit    |                                     |       |
| ERRBIT_PROJECT_KEY                | Errbit Project Key     |    no    |             |                                     |       |
| ERRBIT_ENABLED                    | Errbit Enabled         |    no    |             |                                     |       |

## Geospatial endpoints

flood-service exposes three custom GeoJSON REST endpoints that query the PostGIS database directly, replacing the
equivalent GeoServer WFS layers previously used by [flood-app](https://github.com/DEFRA/flood-app):

| endpoint | description | required query params | optional query params |
|----------|-------------|------------------------|------------------------|
| `GET /stations-geojson` | Water level monitoring stations | - | `startIndex`, `maxFeatures` |
| `GET /rainfall-stations-geojson` | Rainfall monitoring stations | - | `startIndex`, `maxFeatures` |
| `GET /flood-warning-alerts-geojson` | Flood warning/alert areas | `bbox` (format `xmin,ymin,xmax,ymax,EPSG:3857`) | `startIndex`, `maxFeatures` |

Each endpoint returns a standard GeoJSON `FeatureCollection`. All geometry is returned in **EPSG:4326** (WGS84
lon/lat) - consuming clients (e.g. [flood-app](https://github.com/DEFRA/flood-app)'s OpenLayers map) are responsible for reprojecting to their own display
CRS (e.g. EPSG:3857).

### Paging

`startIndex`/`maxFeatures` control pagination and default per-endpoint via the `geoJsonPaging` config block (see
`server/config.js`), configurable via the `FLOOD_SERVICE_*_GEOJSON_DEFAULT_START_INDEX`/`_MAX_FEATURES` environment
variables listed in the Environment variables section above.

### Not OGC compliant

**These endpoints are custom GeoJSON REST endpoints, not OGC WFS or OGC API - Features compliant.** In particular
there is no:

- service contract negotiation (no `GetCapabilities` or `DescribeFeatureType`)
- generic CQL filter or generic paging support beyond the fixed `startIndex`/`maxFeatures` params above
- discoverable schema - the response shape is fixed and intended solely for consumption by [flood-app](https://github.com/DEFRA/flood-app)

Any future requirement for standards-compliant external GIS client access (e.g. QGIS, ArcGIS or other third-party
WFS/OGC API clients) would require either retaining/reinstating GeoServer, or implementing a genuine OGC API -
Features compliant layer alongside these endpoints.

## Prerequisites

Local or remote Postgres/Postgis database installed from: https://github.com/DEFRA/flood-db, connection string `FLOOD_SERVICE_CONNECTION_STRING`

AWS serverless lfw-data tier processing telemetry, forecast, 5DF, fwis data and storing in the database: https://github.com/DEFRA/lfw-data

S3 Bucket storing some of the processed data files, referred to as `FLOOD_SERVICE_S3_BUCKET` in the env vars

Node.js v24

## Testing the application

```
$ npm ci
$ npm run test
```

## Running the application

```
$ npm ci
$ npm run start:local
```
