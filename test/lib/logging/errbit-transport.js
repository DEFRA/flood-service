'use strict'
const Lab = require('@hapi/lab')
const { expect } = require('@hapi/code')
const { experiment, test, beforeEach, afterEach, after } = exports.lab = Lab.script()
const { stub } = require('sinon')
const proxyquire = require('proxyquire')
const { once } = require('node:events')

const stubs = {
  Errbit: stub(),
  send: stub(),
  close: stub(),
  consoleError: stub(console, 'error')
}

const errbitTransport = proxyquire('../../../server/lib/logging/errbit-transport', {
  './errbit': stubs.Errbit
})

experiment('errbit transport', () => {
  beforeEach(() => {
    stubs.Errbit.callsFake(() => ({
      send: stubs.send,
      close: stubs.close
    }))
  })
  afterEach(() => {
    for (const stub of Object.values(stubs)) {
      stub.reset()
    }
  })
  after(() => {
    for (const stub of Object.values(stubs)) {
      if (stub.restore) {
        stub.restore()
      }
    }
  })

  test('it sends messages containing an err to errbit', async () => {
    const stream = errbitTransport({
      severity: 'comical',
      enabled: false,
      host: 'some-host',
      projectId: 'some-project-id',
      projectKey: 'some-project-key',
      environment: 'unit-test',
      version: '0.0.0'
    })
    stubs.send.resolves()
    stubs.close.resolves()

    stream.write(JSON.stringify({
      err: {
        name: 'some-name',
        message: 'some-message',
        stack: 'some-stack',
        code: 1234
      }
    }))
    stream.end()
    await once(stream, 'close')

    expect(stubs.send.callCount).to.equal(1)
    expect(stubs.send.lastCall.args[0]).to.equal({
      err: {
        name: 'some-name',
        message: 'some-message',
        stack: 'some-stack',
        code: 1234
      }
    })
  })
  test('it handles when sending a message to errbit fails', async () => {
    const stream = errbitTransport({
      severity: 'comical',
      enabled: false,
      host: 'some-host',
      projectId: 'some-project-id',
      projectKey: 'some-project-key',
      environment: 'unit-test',
      version: '0.0.0'
    })
    stubs.send.rejects(new Error('not sent'))
    stubs.close.resolves()

    let err
    stream.on('error', (error) => {
      err = error
    })
    stream.write(JSON.stringify({
      err: {
        name: 'some-name',
        message: 'some-message',
        stack: 'some-stack',
        code: 1234
      }
    }))
    stream.end()
    await once(stream, 'close')

    expect(err).to.equal(undefined)
    expect(stubs.consoleError.lastCall.args[0]).to.equal(new Error('not sent'))
  })
  test('it skips messages not containing an err key', async () => {
    const stream = errbitTransport({
      severity: 'comical',
      enabled: false,
      host: 'some-host',
      projectId: 'some-project-id',
      projectKey: 'some-project-key',
      environment: 'unit-test',
      version: '0.0.0'
    })
    stubs.send.resolves()
    stubs.close.resolves()

    stream.write(JSON.stringify({
      message: 'Hello Worlds'
    }))
    stream.end()
    await once(stream, 'close')

    expect(stubs.send.callCount).to.equal(0)
  })

  test('it closes errbit on close', async () => {
    const stream = errbitTransport({
      severity: 'comical',
      enabled: false,
      host: 'some-host',
      projectId: 'some-project-id',
      projectKey: 'some-project-key',
      environment: 'unit-test',
      version: '0.0.0'
    })
    stubs.close.resolves()

    stream.end()
    await once(stream, 'close')

    expect(stubs.close.callCount).to.equal(1)
  })
  test('it handles errors from errbit close', async () => {
    const stream = errbitTransport({
      severity: 'comical',
      enabled: false,
      host: 'some-host',
      projectId: 'some-project-id',
      projectKey: 'some-project-key',
      environment: 'unit-test',
      version: '0.0.0'
    })
    stubs.close.rejects(new Error('bang!'))

    let err
    stream.on('error', (error) => {
      err = error
    })
    stream.end()
    await once(stream, 'close')

    expect(err).to.equal(undefined)
    expect(stubs.consoleError.lastCall.args[0]).to.equal(new Error('bang!'))
  })
})
