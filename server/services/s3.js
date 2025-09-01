const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3')
const { NodeHttpHandler } = require('@smithy/node-http-handler')
const config = require('../config').s3

// Create a configured S3 client.
const s3Client = new S3Client({
  requestHandler: new NodeHttpHandler({
    requestTimeout: config.httpTimeoutMs
  }),
  credentials: {
    accessKeyId: config.accessKey,
    secretAccessKey: config.secretAccessKey
  },
  region: config.region,
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
