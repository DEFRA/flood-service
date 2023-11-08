'use strict'
const Lab = require('@hapi/lab')
const { expect } = require('@hapi/code')
const { experiment, test, beforeEach, afterEach } = exports.lab = Lab.script()
const { stub } = require('sinon')
const proxyquire = require('proxyquire')

const stubs = {
  Notifier: stub(),
  notify: stub(),
  flush: stub()
}

const Errbit = proxyquire('../../../server/lib/logging/errbit', {
  '@airbrake/node': { Notifier: stubs.Notifier }
})

experiment('Errbit', () => {
  beforeEach(() => {
    stubs.Notifier.callsFake(() => ({
      notify: stubs.notify,
      addFilter: stubs.addFilter,
      flush: stubs.flush
    }))
    stubs.flush.callsFake(() => Promise.resolve())
    stubs.notify.callsFake(() => Promise.resolve())
  })
  afterEach(() => {
    for (const stub of Object.values(stubs)) {
      stub.reset()
    }
  })

  test('when enable is false no attempt is made to send notices to airbrake', async () => {
    const options = {
      severity: 'comical',
      enabled: false,
      host: 'some-host',
      projectId: 'some-project-id',
      projectKey: 'some-project-key',
      environment: 'unit-test',
      version: '0.0.0'
    }
    const errbit = new Errbit(options)

    await errbit.send({
      err: {
        name: 'some-name',
        message: 'some-message',
        stack: 'some-stack',
        code: 1234
      }
    })

    expect(stubs.notify.called).to.equal(false)
  })

  test('when enable is true notices are sent to airbrake', async () => {
    const options = {
      severity: 'comical',
      enabled: true,
      host: 'some-host',
      projectId: 'some-project-id',
      projectKey: 'some-project-key',
      environment: 'unit-test',
      version: '0.0.0'
    }
    const errbit = new Errbit(options)

    await errbit.send({
      err: {
        name: 'some-name',
        message: 'some-message',
        stack: 'some-stack',
        code: 1234
      }
    })

    expect(stubs.notify.called).to.equal(true)
  })

  test('when enable is false, and close is called, airbrake remains unflushed', async () => {
    const options = {
      severity: 'comical',
      enabled: false,
      host: 'some-host',
      projectId: 'some-project-id',
      projectKey: 'some-project-key',
      environment: 'unit-test',
      version: '0.0.0'
    }
    const errbit = new Errbit(options)

    await errbit.close()

    expect(stubs.flush.called).to.equal(false)
  })

  test('when enable is true, and close is called, airbrake is flushed', async () => {
    const options = {
      severity: 'comical',
      enabled: true,
      host: 'some-host',
      projectId: 'some-project-id',
      projectKey: 'some-project-key',
      environment: 'unit-test',
      version: '0.0.0'
    }
    const errbit = new Errbit(options)

    await errbit.close()

    expect(stubs.flush.called).to.equal(true)
  })

  test('when incoming data contains an err key, the err is properly formatted before sending', async () => {
    const options = {
      severity: 'comical',
      enabled: true,
      host: 'some-host',
      projectId: 'some-project-id',
      projectKey: 'some-project-key',
      environment: 'unit-test',
      version: '0.0.0'
    }
    const errbit = new Errbit(options)

    await errbit.send({
      err: {
        name: 'some-name',
        message: 'some-message',
        stack: 'some-stack',
        code: 1234
      }
    })

    expect(stubs.notify.lastCall.args[0].error).to.equal({
      name: 'some-name',
      message: 'some-message',
      stack: 'some-stack',
      code: 1234
    })
  })

  test('when incoming data contains req/res information, it is added to the sent notice', async () => {
    const options = {
      severity: 'comical',
      enabled: true,
      host: 'some-host',
      projectId: 'some-project-id',
      projectKey: 'some-project-key',
      environment: 'unit-test',
      version: '0.0.0'
    }
    const errbit = new Errbit(options)

    await errbit.send({
      err: {
        name: 'some-name',
        message: 'some-message',
        stack: 'some-stack',
        code: 1234
      },
      req: {
        url: '/some/path',
        method: 'GET',
        query: {
          a: 1
        }
      },
      res: {
        statusCode: 418
      }
    })

    expect(stubs.notify.lastCall.args[0].context.httpMethod).to.equal('GET')
    expect(stubs.notify.lastCall.args[0].context.route).to.equal('/some/path')
    expect(stubs.notify.lastCall.args[0].params).to.equal({
      request: {
        url: '/some/path',
        method: 'GET',
        query: {
          a: 1
        }
      },
      response: {
        statusCode: 418
      }
    })
  })

  test('the environment, version and severity are added to notices before sending', async () => {
    const options = {
      severity: 'comical',
      enabled: true,
      host: 'some-host',
      projectId: 'some-project-id',
      projectKey: 'some-project-key',
      environment: 'unit-test',
      version: '0.0.0'
    }
    const errbit = new Errbit(options)

    await errbit.send({
      err: {
        name: 'some-name',
        message: 'some-message',
        stack: 'some-stack',
        code: 1234
      }
    })

    expect(stubs.notify.lastCall.args[0].context.version).to.equal('0.0.0')
    expect(stubs.notify.lastCall.args[0].context.environment).to.equal('unit-test')
    expect(stubs.notify.lastCall.args[0].context.severity).to.equal('comical')
  })
})
