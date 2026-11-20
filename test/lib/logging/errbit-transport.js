'use strict'
const { once } = require('node:events')

jest.mock('../../../server/lib/logging/errbit', () => jest.fn())

const Errbit = require('../../../server/lib/logging/errbit')
const errbitTransport = require('../../../server/lib/logging/errbit-transport')

const mockSend = jest.fn()
const mockClose = jest.fn()

describe('errbit transport', () => {
  let consoleError

  beforeEach(() => {
    jest.resetAllMocks()
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    Errbit.mockImplementation(() => ({
      send: mockSend,
      close: mockClose
    }))
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
    mockSend.mockResolvedValue()
    mockClose.mockResolvedValue()

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

    expect(mockSend).toHaveBeenCalledTimes(1)
    expect(mockSend).toHaveBeenLastCalledWith({
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
    mockSend.mockRejectedValue(new Error('not sent'))
    mockClose.mockResolvedValue()

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

    expect(err).toBeUndefined()
    expect(consoleError).toHaveBeenLastCalledWith(new Error('not sent'))
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
    mockSend.mockResolvedValue()
    mockClose.mockResolvedValue()

    stream.write(JSON.stringify({
      message: 'Hello Worlds'
    }))
    stream.end()
    await once(stream, 'close')

    expect(mockSend).not.toHaveBeenCalled()
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
    mockClose.mockResolvedValue()

    stream.end()
    await once(stream, 'close')

    expect(mockClose).toHaveBeenCalledTimes(1)
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
    mockClose.mockRejectedValue(new Error('bang!'))

    let err
    stream.on('error', (error) => {
      err = error
    })
    stream.end()
    await once(stream, 'close')

    expect(err).toBeUndefined()
    expect(consoleError).toHaveBeenLastCalledWith(new Error('bang!'))
  })
})
