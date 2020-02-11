const boom = require('@hapi/boom')
const s3Service = require('../services/s3')

module.exports = {
  method: 'GET',
  path: '/flood-guidance-statement',
  options: {
    description: 'Get the flood guidance statement',
  },
  handler: async (request, h) => {
    try {
      const result = await s3Service.floodGuidanceStatement()
      return result
    } catch (err) {
      console.log(err)
      return boom.badRequest('Failed to get the flood guidance statement', err)
    }
  }
}
