'use strict'
const pino = require('pino')
const config = require('../../config')
const createLoggingTarget = require('./create-logging-target')

module.exports = pino({
  level: config.logLevel.toLowerCase(),
  timestamp: pino.stdTimeFunctions.isoTime,
  base: {},
  formatters: {
    level: (label, number) => ({
      logLevel: label.toUpperCase(),
      level: number
    })
  }
}, pino.transport({
  targets: [
    createLoggingTarget('fatal'),
    createLoggingTarget('error'),
    createLoggingTarget('warn'),
    createLoggingTarget('info'),
    createLoggingTarget('debug'),
    createLoggingTarget('trace')
  ],
  dedupe: true
}))
