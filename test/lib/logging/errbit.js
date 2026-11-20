'use strict'

const mockNotify = jest.fn()
const mockFlush = jest.fn()

jest.mock('@airbrake/node', () => ({
  Notifier: jest.fn(() => ({
    notify: mockNotify,
    flush: mockFlush
  }))
}))

const Errbit = require('../../../server/lib/logging/errbit')

describe('Errbit', () => {
  beforeEach(() => {
    mockNotify.mockReset().mockResolvedValue()
    mockFlush.mockReset().mockResolvedValue()
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

    expect(mockNotify).not.toHaveBeenCalled()
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

    expect(mockNotify).toHaveBeenCalled()
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

    expect(mockFlush).not.toHaveBeenCalled()
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

    expect(mockFlush).toHaveBeenCalled()
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

    expect(mockNotify.mock.lastCall[0].error).toEqual({
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

    expect(mockNotify.mock.lastCall[0].context.httpMethod).toBe('GET')
    expect(mockNotify.mock.lastCall[0].context.route).toBe('/some/path')
    expect(mockNotify.mock.lastCall[0].params).toEqual({
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

    expect(mockNotify.mock.lastCall[0].context.version).toBe('0.0.0')
    expect(mockNotify.mock.lastCall[0].context.environment).toBe('unit-test')
    expect(mockNotify.mock.lastCall[0].context.severity).toBe('comical')
  })
})
