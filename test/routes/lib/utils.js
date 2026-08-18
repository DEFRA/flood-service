'use strict'

const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()

const lab = exports.lab = Lab.script()

const buildUtils = ({ geoJsonPaging, services }) => {
  return proxyquire('../../../server/routes/lib/utils', {
    '../../config': { geoJsonPaging },
    '../../services/index': services
  })
}

lab.experiment('Route utils', () => {
  lab.test('pagingValidationFailActionHandler returns bad request', async () => {
    const { pagingValidationFailActionHandler } = buildUtils({
      geoJsonPaging: {},
      services: {}
    })

    const error = new Error('"maxFeatures" must be greater than or equal to 1')
    const response = pagingValidationFailActionHandler({}, null, error)

    Code.expect(response.isBoom).to.equal(true)
    Code.expect(response.output.statusCode).to.equal(400)
    Code.expect(response.message).to.startWith('Invalid query parameters:')
  })

  lab.test('createPagedGeoJsonHandler applies configured paging defaults', async () => {
    const serviceStub = sinon.stub().resolves({ ok: true })
    const { createPagedGeoJsonHandler } = buildUtils({
      geoJsonPaging: {
        stations: {
          defaultStartIndex: 10,
          defaultMaxFeatures: 250
        }
      },
      services: {
        getStationsGeoJson: serviceStub
      }
    })

    const handler = createPagedGeoJsonHandler({
      serviceFunctionName: 'getStationsGeoJson',
      pagingConfigName: 'stations',
      getQueryParams: () => ['bbox'],
      errorMessage: 'Failed to get stations GeoJSON'
    })

    await handler({ query: { maxFeatures: 5 } })
    await handler({ query: { startIndex: 2 } })

    Code.expect(serviceStub.firstCall.args[0]).to.equal(['bbox'])
    Code.expect(serviceStub.firstCall.args[1]).to.equal({ offset: 10, limit: 5 })
    Code.expect(serviceStub.secondCall.args[0]).to.equal(['bbox'])
    Code.expect(serviceStub.secondCall.args[1]).to.equal({ offset: 2, limit: 250 })
  })

  lab.test('createPagedGeoJsonHandler returns bad request for invalid paging config', async () => {
    const { createPagedGeoJsonHandler } = buildUtils({
      geoJsonPaging: {},
      services: {
        getStationsGeoJson: sinon.stub().resolves({ ok: true })
      }
    })

    const handler = createPagedGeoJsonHandler({
      serviceFunctionName: 'getStationsGeoJson',
      pagingConfigName: 'missingConfig',
      getQueryParams: () => [],
      errorMessage: 'Failed to get stations GeoJSON'
    })

    const response = await handler({ query: {} })
    Code.expect(response.isBoom).to.equal(true)
    Code.expect(response.output.statusCode).to.equal(400)
    Code.expect(response.message).to.equal('Failed to get stations GeoJSON')
  })

  lab.test('createPagedGeoJsonHandler returns bad request for invalid service function', async () => {
    const { createPagedGeoJsonHandler } = buildUtils({
      geoJsonPaging: {
        stations: {
          defaultStartIndex: 0,
          defaultMaxFeatures: 1000
        }
      },
      services: {}
    })

    const handler = createPagedGeoJsonHandler({
      serviceFunctionName: 'missingFunction',
      pagingConfigName: 'stations',
      getQueryParams: () => [],
      errorMessage: 'Failed to get stations GeoJSON'
    })

    const response = await handler({ query: {} })
    Code.expect(response.isBoom).to.equal(true)
    Code.expect(response.output.statusCode).to.equal(400)
    Code.expect(response.message).to.equal('Failed to get stations GeoJSON')
  })
})
