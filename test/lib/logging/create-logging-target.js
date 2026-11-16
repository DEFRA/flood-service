'use strict'

const config = require('../../../server/config')
const pino = require('pino')
const createLoggingTarget = require('../../../server/lib/logging/create-logging-target')

describe('createLoggingTarget', () => {
  let originalConfig
  beforeAll(() => {
    originalConfig = JSON.parse(JSON.stringify(config))
  })
  afterAll(() => {
    Object.assign(config, originalConfig)
  })
  test('it logs json to file when isPM2 is true', () => {
    config.isPM2 = true

    const actual = Object.values(pino.levels.labels).map(level => createLoggingTarget(level))

    const targets = [...new Set(actual.map(({ target }) => target))]
    expect(targets).toEqual(['pino/file'])

    const destinations = Object.fromEntries(
      actual.map(({ level, options: { destination } }) => [level, destination])
    )
    expect(destinations.trace).toEndWith('.pino.out.log')
    expect(destinations.debug).toEndWith('.pino.out.log')
    expect(destinations.info).toEndWith('.pino.out.log')
    expect(destinations.warn).toEndWith('.pino.out.log')
    expect(destinations.error).toEndWith('.pino.err.log')
    expect(destinations.fatal).toEndWith('.pino.err.log')
  })
  test('it logs pretty print to process when isPM2 is false', () => {
    config.isPM2 = false

    const actual = Object.values(pino.levels.labels).map(level => createLoggingTarget(level))

    const targets = [...new Set(actual.map(({ target }) => target))]
    expect(targets).toEqual(['pino-pretty'])

    const destinations = Object.fromEntries(
      actual.map(({ level, options: { destination } }) => [level, destination])
    )
    expect(destinations).toEqual({
      trace: 1,
      debug: 1,
      info: 1,
      warn: 1,
      error: 2,
      fatal: 2
    })
  })
})
