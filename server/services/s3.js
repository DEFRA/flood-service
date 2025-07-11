const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3')
const config = require('../config').s3

// Create S3 client with credentials
const s3Client = new S3Client({
  credentials: {
    accessKeyId: config.accessKey,
    secretAccessKey: config.secretAccessKey
  },
  requestTimeout: config.httpTimeoutMs,
  maxAttempts: 3 // Equivalent to maxRetries in v2
})

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
