const boom = require('@hapi/boom')
const s3Service = require('../services/s3')

module.exports = {
  method: 'GET',
  path: '/flood-guidance-statement',
  options: {
    description: 'Get the flood guidance statement'
  },
  handler: async () => {
    try {
      return await s3Service.floodGuidanceStatement()
    } catch (err) {
      console.log(err)
      return boom.badRequest('Failed to get the flood guidance statement', err)
    }
  }
}
