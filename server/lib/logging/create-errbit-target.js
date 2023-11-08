'use strict'
const config = require('../../config')

module.exports = function createLoggingTarget (level, severity) {
  return {
    level,
    target: require.resolve('./errbit-transport'),
    options: {
      severity,
      projectKey: config.errbit.projectKey,
      projectId: config.errbit.projectId,
      enabled: config.errbit.enabled,
      host: config.errbit.host,
      environment: config.env,
      version: config.version
    }
  }
}
