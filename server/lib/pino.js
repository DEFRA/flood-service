'use strict'
const pino = require('pino')
const { isPM2, logLevel } = require('../config')
const { join } = require('path')
const logDir = join(__dirname, '../../logs')

const transport = pino.transport({
  dedupe: true,
  targets: Object.entries(pino.levels.labels)
    .filter(([level]) => level !== 'silent')
    .map(([level, label]) => {
      let destination = isPM2 ? join(logDir, '.pino.out.log') : 1
      if (parseInt(level) >= pino.levels.values.error) {
        destination = isPM2 ? join(logDir, '.pino.err.log') : 2
      }
      return {
        target: isPM2 ? 'pino/file' : 'pino-pretty',
        level: label,
        options: {
          destination,
          mkdir: true
        }
      }
    })
})

module.exports = pino({
  level: logLevel.toLowerCase(),
  timestamp: pino.stdTimeFunctions.isoTime,
  base: {},
  formatters: {
    level: (label, number) => ({
      logLevel: label.toUpperCase(),
      level: number
    })
  }
}, transport)
