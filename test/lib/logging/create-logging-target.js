'use strict'
const Lab = require('@hapi/lab')
const { expect } = require('@hapi/code')
const { experiment, test, before, after } = exports.lab = Lab.script()
const config = require('../../../server/config')
const pino = require('pino')
const createLoggingTarget = require('../../../server/lib/logging/create-logging-target')

experiment('createLoggingTarget', () => {
  let originalConfig
  before(() => {
    originalConfig = JSON.parse(JSON.stringify(config))
  })
  after(() => {
    Object.assign(config, originalConfig)
  })
  test('it logs json to file when isPM2 is true', () => {
    config.isPM2 = true

    const actual = Object.values(pino.levels.labels).map(level => createLoggingTarget(level))

    const targets = [...new Set(actual.map(({ target }) => target))]
    expect(targets).to.equal(['pino/file'])

    const destinations = Object.fromEntries(
      actual.map(({ level, options: { destination } }) => [level, destination])
    )
    expect(destinations.trace).to.endWith('.pino.out.log')
    expect(destinations.debug).to.endWith('.pino.out.log')
    expect(destinations.info).to.endWith('.pino.out.log')
    expect(destinations.warn).to.endWith('.pino.out.log')
    expect(destinations.error).to.endWith('.pino.err.log')
    expect(destinations.fatal).to.endWith('.pino.err.log')
  })
  test('it logs pretty print to process when isPM2 is false', () => {
    config.isPM2 = false

    const actual = Object.values(pino.levels.labels).map(level => createLoggingTarget(level))

    const targets = [...new Set(actual.map(({ target }) => target))]
    expect(targets).to.equal(['pino-pretty'])

    const destinations = Object.fromEntries(
      actual.map(({ level, options: { destination } }) => [level, destination])
    )
    expect(destinations).to.equal({
      trace: 1,
      debug: 1,
      info: 1,
      warn: 1,
      error: 2,
      fatal: 2
    })
  })
})
