const routes = [].concat(
  require('../routes/floods'),
  require('../routes/flood-area-alert'),
  require('../routes/flood-area-warning'),
  require('../routes/flood-guidance-statement'),
  require('../routes/floods-within'),
  require('../routes/forecast-data'),
  require('../routes/impacts-within'),
  require('../routes/impacts'),
  require('../routes/is-england'),
  require('../routes/station'),
  require('../routes/river'),
  require('../routes/river-station-by-station-id.js'),
  require('../routes/station-telemetry'),
  require('../routes/stations-within'),
  require('../routes/thresholds-data')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
