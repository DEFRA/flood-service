const joi = require('@hapi/joi')
const boom = require('@hapi/boom')
const services = require('../services/index')

module.exports = {
  method: 'GET',
  path: '/river-by-riverid-or-wiskiname/{riverId}/{riverName}',
  handler: async request => {
    try {
      const { riverID, riverName } = request.params
      return services.getRiverByIdOrWiskiName(riverID, riverName)
    } catch (err) {
      return boom.badRequest('Failed to get stations by river_id or wiski_name', err)
    }
  },
  options: {
    description: 'Get stations by river_id or Wiski_River_Name',
    validate: {
      params: joi.object({
        riverId: joi.string().required(),
        riverName: joi.string().required()
      })
    }
  }
}
