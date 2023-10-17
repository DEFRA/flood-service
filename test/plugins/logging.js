'use strict'

const Lab = require('@hapi/lab')
const { expect } = require('@hapi/code')
const loggingPlugin = require('../../server/plugins/logging')
const lab = exports.lab = Lab.script()

lab.experiment('logging plugin', () => {
  lab.test('req serializer with query', async () => {
    const req = {
      url: '/some/url',
      method: 'get',
      query: {
        q: 'hi'
      }
    }

    const actual = loggingPlugin.options.serializers.req(req)

    expect(actual).to.equal({
      url: '/some/url',
      method: 'GET',
      query: {
        q: 'hi'
      }
    })
  })
  lab.test('req serializer with empty query', async () => {
    const req = {
      url: '/some/url',
      method: 'get',
      header: {
        'x-api-key': '12345'
      },
      query: {}
    }

    const actual = loggingPlugin.options.serializers.req(req)

    expect(actual).to.equal({
      url: '/some/url',
      method: 'GET',
      query: undefined
    })
  })
  lab.test('req serializer without query', async () => {
    const req = {
      url: '/some/url',
      method: 'get',
      header: {
        'x-api-key': '12345'
      }
    }

    const actual = loggingPlugin.options.serializers.req(req)

    expect(actual).to.equal({
      url: '/some/url',
      method: 'GET',
      query: undefined
    })
  })

  lab.test('res serializer', async () => {
    const res = {
      statusCode: 200,
      header: {
        'x-api-key': '12345'
      }
    }

    const actual = loggingPlugin.options.serializers.res(res)

    expect(actual).to.equal({
      statusCode: 200
    })
  })
})
