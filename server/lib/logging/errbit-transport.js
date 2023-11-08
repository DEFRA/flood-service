'use strict'
const Errbit = require('./errbit')
const createAbstractTransport = require('pino-abstract-transport')

module.exports = ({ severity, enabled, host, projectId, projectKey, environment, version }) => {
  const errbit = new Errbit({ severity, enabled, host, projectId, projectKey, environment, version })

  return createAbstractTransport(async source => {
    for await (const data of source) {
      if (data.err) {
        await errbit.send(data).catch(console.error)
      }
    }
  }, {
    close: () => errbit.close().catch(console.error)
  })
}
