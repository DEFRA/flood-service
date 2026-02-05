const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3')
const { NodeHttpHandler } = require('@smithy/node-http-handler')
const config = require('../config').s3

// Create S3 client config
const s3Config = {
  requestHandler: new NodeHttpHandler({
    requestTimeout: config.httpTimeoutMs
  }),
  region: config.region,
  maxAttempts: 3 // Equivalent to maxRetries in v2
}

// Only add credentials if provided (local development)
// In deployed environments, IAM roles will be used automatically
if (config.accessKey && config.secretAccessKey) {
  s3Config.credentials = {
    accessKeyId: config.accessKey,
    secretAccessKey: config.secretAccessKey
  }
}

// Add endpoint for localstack if provided
if (process.env.AWS_ENDPOINT_URL) {
  s3Config.endpoint = process.env.AWS_ENDPOINT_URL
  s3Config.forcePathStyle = true // Required for localstack
}

// Create a configured S3 client.
const s3Client = new S3Client(s3Config)

module.exports = {
  floodGuidanceStatement: async () => {
    const params = {
      Key: 'fgs/latest.json',
      Bucket: config.bucket
    }

    const command = new GetObjectCommand(params)
    const response = await s3Client.send(command)
    const bodyContents = await response.Body.transformToString()
    return JSON.parse(bodyContents)
  },
  ffoi: async (id) => {
    const params = {
      Bucket: config.bucket,
      Key: `ffoi/${id}.json`
    }

    const command = new GetObjectCommand(params)
    const response = await s3Client.send(command)
    const bodyContents = await response.Body.transformToString()
    return JSON.parse(bodyContents)
  }
}
