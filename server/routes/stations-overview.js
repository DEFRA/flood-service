const Boom = require('@hapi/boom')
const service = require('../services')

module.exports = {
  method: 'GET',
  path: '/stations-overview',
  options: {
    description: 'Get stations overview',
    handler: async () => {
      try {
        return await service.getStationsOverview()
      } catch (err) {
        return Boom.badRequest('Failed to get stations overview data', err)
      }
    }
  }
}
