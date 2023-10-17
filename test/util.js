const Lab = require('@hapi/lab')
const { expect } = require('@hapi/code')
const lab = exports.lab = Lab.script()
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const mocks = {
  wreckGet: sinon.stub(),
  wreckPost: sinon.stub()
}

lab.experiment('util / outbound request helpers : request', () => {
  let util
  lab.before(() => {
    util = proxyquire('../server/util', {
      wreck: {
        defaults: () => ({
          get: mocks.wreckGet,
          post: mocks.wreckPost
        })
      }
    })
  })
  lab.afterEach(() => {
    for (const stub of Object.values(mocks)) {
      stub.reset()
    }
  })

  lab.test('request uses acts as a proxy for the relevant wreck method', async () => {
    const getUrl = '/some/get/url'
    const postUrl = '/some/post/url'
    const requestOptions = {
      headers: {
        'some-header': 'some-value'
      }
    }
    const mockResponse = { res: { statusCode: 200, headers: {} }, payload: { ok: true } }
    mocks.wreckGet.resolves(mockResponse)
    mocks.wreckPost.resolves(mockResponse)

    const [
      getResult,
      postResult
    ] = await Promise.all([
      util.request('get', getUrl, requestOptions),
      util.request('post', postUrl, requestOptions)
    ])

    expect(mocks.wreckGet.callCount).to.equal(1)
    expect(mocks.wreckGet.firstCall.args).to.equal([getUrl, requestOptions])
    expect(getResult).to.equal(mockResponse.payload)

    expect(mocks.wreckPost.callCount).to.equal(1)
    expect(mocks.wreckPost.firstCall.args).to.equal([postUrl, requestOptions])
    expect(postResult).to.equal(mockResponse.payload)
  })

  lab.test('request adds the method and url to wreck request errors', async () => {
    const method = 'get'
    const url = '/some/get/url'
    const requestOptions = {
      headers: {
        'some-header': 'some-value'
      }
    }
    const requestError = new Error('Response Error: some response error')
    mocks.wreckGet.rejects(requestError)

    let err
    try {
      await util.request(method, url, requestOptions)
    } catch (e) {
      err = e
    }

    expect(err.message).to.equal('Response Error: some response error on GET /some/get/url')
  })

  lab.test('request does not add the method and url to wreck non-request errors', async () => {
    const method = 'get'
    const url = '/some/get/url'
    const requestOptions = {
      headers: {
        'some-header': 'some-value'
      }
    }
    const requestError = new Error('some other error')
    mocks.wreckGet.rejects(requestError)

    let err
    try {
      await util.request(method, url, requestOptions)
    } catch (e) {
      err = e
    }

    expect(err.message).to.equal('some other error')
  })
})
