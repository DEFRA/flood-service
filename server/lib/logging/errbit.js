'use strict'
const { Notifier } = require('@airbrake/node')

module.exports = class Errbit {
  constructor (opts) {
    this._opts = opts
    if (this._opts.enabled) {
      this._airbrake = new Notifier({
        host: this._opts.host,
        projectId: this._opts.projectId,
        projectKey: this._opts.projectKey,
        environment: this._opts.environment,
        errorNotifications: true,
        remoteConfig: false
      })
    }
  }

  _formatNotice (data) {
    const notification = {
      error: data.err,
      context: {
        environment: this._opts.environment,
        version: this._opts.version,
        severity: this._opts.severity
      },
      params: {}
    }
    if (data.req) {
      notification.context.httpMethod = data.req.method
      notification.context.route = data.req.url
      notification.params.request = data.req
    }
    if (data.res) {
      notification.params.response = data.res
    }
    return notification
  }

  async send (data) {
    if (this._airbrake) {
      await this._airbrake.notify(this._formatNotice(data))
    }
  }

  async close () {
    if (this._airbrake) {
      await this._airbrake.flush(1000)
    }
  }
}
