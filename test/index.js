'use strict'

const mocks = {
  createServer: jest.fn(),
  start: jest.fn(),
  exit: jest.fn(),
  flush: jest.fn(),
  fatal: jest.fn()
}

jest.mock('../server', () => (...args) => mocks.createServer(...args))
jest.mock('../server/lib/logging/pino', () => ({
  fatal: (...args) => mocks.fatal(...args),
  flush: (...args) => mocks.flush(...args)
}))

// index.js runs on require, so load a fresh copy per test
const index = () => {
  let result
  jest.isolateModules(() => {
    result = require('../index')
  })
  return result
}

describe('Server fail test', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.spyOn(process, 'exit').mockImplementation(mocks.exit)
  })

  test('it should handle errors with createServer()', async () => {
    mocks.createServer.mockRejectedValue(new Error('create server went wrong'))
    mocks.flush.mockImplementation(cb => cb())

    let error
    try {
      await index()
    } catch (e) {
      error = e
    }
    expect(error).toBeUndefined()
    expect(mocks.fatal).toHaveBeenCalledTimes(1)
    expect(mocks.exit).toHaveBeenCalledTimes(1)
    expect(mocks.exit).toHaveBeenLastCalledWith(1)
  })

  test('it should handle errors with server.start()', async () => {
    mocks.createServer.mockResolvedValue({ start: mocks.start, listener: {} })
    mocks.start.mockRejectedValue(new Error('server start went wrong'))
    mocks.flush.mockImplementation(cb => cb())

    let error
    try {
      await index()
    } catch (e) {
      error = e
    }
    expect(error).toBeUndefined()
    expect(mocks.fatal).toHaveBeenCalledTimes(1)
    expect(mocks.exit).toHaveBeenCalledTimes(1)
    expect(mocks.exit).toHaveBeenLastCalledWith(1)
  })

  test('it disables requestTimeout and headersTimeout', async () => {
    const listener = {}
    mocks.createServer.mockResolvedValue({ start: mocks.start, listener })
    mocks.start.mockResolvedValue(undefined)
    mocks.flush.mockImplementation(cb => cb())

    let error
    try {
      await index()
    } catch (e) {
      error = e
    }
    expect(error).toBeUndefined()
    expect(mocks.fatal).not.toHaveBeenCalled()
    expect(mocks.exit).not.toHaveBeenCalled()
    expect(listener.requestTimeout).toBe(0)
    expect(listener.headersTimeout).toBe(0)
  })
})
