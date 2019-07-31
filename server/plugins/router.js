const routes = [
  require('../routes/floods'),
  require('../routes/flood-area-alert'),
  require('../routes/flood-area-warning'),
  require('../routes/floods-within'),
  require('../routes/forecast-data'),
  require('../routes/impacts-within'),
  require('../routes/impacts'),
  require('../routes/is-england'),
  require('../routes/station'),
  require('../routes/stations-upstream-downstream'),
  require('../routes/station-telemetry'),
  require('../routes/stations-within'),
  require('../routes/stations-within-radius'),
  require('../routes/thresholds-data')
]

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
