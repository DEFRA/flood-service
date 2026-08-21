const joi = require('joi')
const boom = require('@hapi/boom')
const { geoJsonPaging } = require('../../config')
const floodsService = require('../../services/index')

// Base query schema shared by all paged GeoJSON endpoints. Endpoints with extra
// query params (e.g. bbox) extend this via createGeoJsonRoute's extraQuerySchema.
const pagingQuerySchema = {
  maxFeatures: joi.number().integer().min(1).optional(),
  startIndex: joi.number().integer().min(0).optional()
}

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

// Builds a full route module for a paged GeoJSON endpoint (method, path, handler,
// options), removing the boilerplate duplicated across stations/rainfall-stations/
// flood-warning-alerts route files. `extraQuerySchema`/`getQueryParams` let
// endpoints with extra query params (e.g. bbox) extend the base paging schema/params;
// endpoints with none can omit them.
function createGeoJsonRoute ({ path, serviceFunctionName, pagingConfigName, description, errorMessage, extraQuerySchema = {}, getQueryParams = () => [] }) {
  return {
    method: 'GET',
    path,
    handler: createPagedGeoJsonHandler({ serviceFunctionName, pagingConfigName, getQueryParams, errorMessage }),
    options: {
      description,
      validate: {
        query: joi.object({ ...pagingQuerySchema, ...extraQuerySchema }),
        failAction: pagingValidationFailActionHandler
      }
    }
  }
}

module.exports = {
  pagingValidationFailActionHandler,
  createPagedGeoJsonHandler,
  createGeoJsonRoute
}
