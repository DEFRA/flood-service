'use strict'
const config = require('../../config')
const { join } = require('path')

const logDir = join(__dirname, '../../../logs')

module.exports = function createLoggingTarget (level) {
  const target = config.isPM2 ? 'pino/file' : 'pino-pretty'
  let destination
  if (level === 'fatal' || level === 'error') {
    destination = config.isPM2 ? join(logDir, '.pino.err.log') : 2
  } else {
    destination = config.isPM2 ? join(logDir, '.pino.out.log') : 1
  }

  return {
    target,
    level,
    options: {
      destination,
      mkdir: true
    }
  }
}
