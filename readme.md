# flood-service

# Environment variables
| name     | description      | required | default |            valid            | notes |
|----------|------------------|:--------:|---------|:---------------------------:|-------|
| NODE_ENV | Node environment |    no    |         | development,test,production |       |
| PORT     | Port number      |    no    | 3000    |                             |       |
| FLOOD_SERVICE_CONNECTION_STRING | PG Connection String |    yes    |         |  |       |
| FLOOD_SERVICE_S3_ACCESS_KEY     | S3∏ Access Key      |    yes    |     | |       |
| FLOOD_SERVICE_S3_SECRET_ACCESS_KEY | S3 Secret Key |    yes    |         |  |       |
| FLOOD_SERVICE_S3_BUCKET     | S3 Bucket      |    yes    |     ||       |
| FLOOD_SERVICE_S3_KEY | S3 Key |    yes    |         |  |       |
| FLOOD_SERVICE_S3_PROXY     | S3 Proxy      |    yes    |     ||       |
| FLOOD_SERVICE_S3_TIMEOUT     | S3 Http Timeout      |    no    | 10000 (10s)    ||       |

# Prerequisites

Node v8+

# Running the application

`$ node index.js`
