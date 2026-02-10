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

// Check if running in ECS (where IAM roles provide credentials automatically)
const isRunningInECS = process.env.AWS_EXECUTION_ENV && process.env.AWS_EXECUTION_ENV.toUpperCase() === 'AWS_ECS_FARGATE'

// Validate credentials are provided when not in ECS
if (!isRunningInECS && (!config.accessKey || !config.secretAccessKey)) {
  throw new Error('AWS credentials (AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY) are required for local development')
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
