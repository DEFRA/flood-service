const boom = require('@hapi/boom')
const { geoJsonPaging } = require('../../config')
const floodsService = require('../../services/index')

// Handle joi validation failures for paging query parameters
// Returns boom.badRequest with error details
function pagingValidationFailActionHandler (request, h, error) {
  return boom.badRequest('Invalid query parameters: ' + error.message)
}

// Shared route handler for paged GeoJSON endpoints.
// It applies common paging setup and error handling, while the caller provides
// the service function name and any endpoint-specific query parameter extraction.
function createPagedGeoJsonHandler ({ serviceFunctionName, pagingConfigName, getQueryParams, errorMessage }) {
  return async request => {
    try {
      const pagingConfig = geoJsonPaging[pagingConfigName]
      if (!pagingConfig) {
        throw new Error(`Invalid paging config: ${pagingConfigName}`)
      }

      const { maxFeatures, startIndex } = request.query

      const pagingOptions = {
        offset: startIndex ?? pagingConfig.defaultStartIndex,
        limit: maxFeatures ?? pagingConfig.defaultMaxFeatures
      }

      if (typeof floodsService[serviceFunctionName] !== 'function') {
        throw new Error(`Invalid service function: ${serviceFunctionName}`)
      }

      return await floodsService[serviceFunctionName](getQueryParams(request), pagingOptions)
    } catch (err) {
      if (boom.isBoom(err)) {
        return err
      }
      return boom.badRequest(errorMessage, err)
    }
  }
}

module.exports = {
  pagingValidationFailActionHandler,
  createPagedGeoJsonHandler
}
