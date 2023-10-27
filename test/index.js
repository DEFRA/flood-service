'use strict'

const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()
const { expect } = require('@hapi/code')
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()

const mocks = {
  createServer: sinon.stub(),
  start: sinon.stub(),
  exit: sinon.stub(),
  flush: sinon.stub(),
  fatal: sinon.stub()
}

const index = () => proxyquire('../index', {
  './server': mocks.createServer,
  './server/lib/logging/pino': {
    fatal: mocks.fatal,
    flush: mocks.flush
  }
})

lab.experiment('Server fail test', () => {
  let originalExit
  lab.beforeEach(() => {
    originalExit = process.exit
    process.exit = mocks.exit
    mocks.exit.callsFake(() => {
      process.exit = originalExit
    })
  })

  lab.afterEach(() => {
    for (const mock of Object.values(mocks)) {
      mock.reset()
    }
    process.exit = originalExit
  })

  lab.test('it should handle errors with createServer()', async () => {
    mocks.createServer.rejects(new Error('create server went wrong'))
    mocks.fatal.returns(undefined)
    mocks.flush.callsFake(cb => cb())

    let error
    try {
      await index()
    } catch (e) {
      error = e
    }
    expect(error).to.equal(undefined)
    expect(mocks.fatal.callCount).to.equal(1)
    expect(mocks.exit.callCount).to.equal(1)
    expect(mocks.exit.lastCall.args[0]).to.equal(1)
  })

  lab.test('it should handle errors with server.start()', async () => {
    mocks.createServer.resolves({ start: mocks.start, listener: {} })
    mocks.start.rejects(new Error('server start went wrong'))
    mocks.fatal.returns(undefined)
    mocks.flush.callsFake(cb => cb())

    let error
    try {
      await index()
    } catch (e) {
      error = e
    }
    expect(error).to.equal(undefined)
    expect(mocks.fatal.callCount).to.equal(1)
    expect(mocks.exit.callCount).to.equal(1)
    expect(mocks.exit.lastCall.args[0]).to.equal(1)
  })

  lab.test('it disables requestTimeout and headersTimeout', async () => {
    const listener = {}
    mocks.createServer.resolves({ start: mocks.start, listener })
    mocks.start.resolves(undefined)
    mocks.fatal.returns(undefined)
    mocks.flush.callsFake(cb => cb())

    let error
    try {
      await index()
    } catch (e) {
      error = e
    }
    expect(error).to.equal(undefined)
    expect(mocks.fatal.callCount).to.equal(0)
    expect(mocks.exit.callCount).to.equal(0)
    expect(listener.requestTimeout).to.equal(0)
    expect(listener.headersTimeout).to.equal(0)
  })
})
