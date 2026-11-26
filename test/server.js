'use strict'

// Avoids initialising file transports under <repo>/logs when PM2_HOME is set
jest.mock('../server/lib/logging/pino', () => require('pino')({ level: 'silent' }))

describe('createServer', () => {
  afterEach(() => {
    delete process.env.PM2_HOME
    jest.resetModules()
  })

  test('registers the route-logger plugin when not running under PM2', async () => {
    delete process.env.PM2_HOME
    const server = await require('../server')()

    expect(server.registrations['route-logger']).toBeDefined()
  })

  test('skips the route-logger plugin when running under PM2', async () => {
    process.env.PM2_HOME = '/tmp/.pm2'
    const server = await require('../server')()

    expect(server.registrations['route-logger']).toBeUndefined()
  })
})
