[![Build Status](https://travis-ci.com/DEFRA/flood-service.svg?branch=master)](https://travis-ci.com/DEFRA/flood-service)[![Maintainability](https://api.codeclimate.com/v1/badges/5984525ed1ab73b76869/maintainability)](https://codeclimate.com/github/DEFRA/flood-service/maintainability)[![Test Coverage](https://api.codeclimate.com/v1/badges/5984525ed1ab73b76869/test_coverage)](https://codeclimate.com/github/DEFRA/flood-service/test_coverage)

# flood-service

# Environment variables
| name     | description      | required | default |            valid            | notes |
|----------|------------------|:--------:|---------|:---------------------------:|-------|
| NODE_ENV | Node environment |    no    |development| development,test,production |       |
| PORT     | Port number      |    no    | 3000    |                             |       |
| FLOOD_SERVICE_CONNECTION_STRING | PG Connection String |    yes    |         |  |       |
| FLOOD_SERVICE_S3_ACCESS_KEY     | S3 Access Key      |    yes    |     | |       |
| FLOOD_SERVICE_S3_SECRET_ACCESS_KEY | S3 Secret Key |    yes    |         |  |       |
| FLOOD_SERVICE_S3_BUCKET     | S3 Bucket      |    yes    |     ||       |
| FLOOD_SERVICE_S3_KEY | S3 Key |    yes    |         |  |       |
| FLOOD_SERVICE_S3_PROXY     | S3 Proxy      |    yes    |     ||       |
| FLOOD_SERVICE_S3_TIMEOUT     | S3 Http Timeout      |    no    | 10000 (10s)    ||       |
| FLOOD_SERVICE_ERRBIT_POST_ERRORS | Errbit activation |    no    |   true, false   |  |       |
| FLOOD_SERVICE_ERRBIT_ENV     | Errbit env      |    no    |     ||       |
| FLOOD_SERVICE_ERRBIT_KEY | Errbit key |    no    |         |  |       |
| FLOOD_SERVICE_ERRBIT_HOST     | Errbit host      |    no    |     ||       |
| FLOOD_SERVICE_ERRBIT_PROXY  | Errbit proxy |    no    | ''    ||       |

# Prerequisites

Node v8+

# Running the application

`$ node index.js`
