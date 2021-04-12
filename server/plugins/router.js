const routes = [].concat(
  require('../routes/index'),
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
  require('../routes/stations'),
  require('../routes/stations-within'),
  require('../routes/stations-within-target-area'),
  require('../routes/warnings-alerts-within-station-buffer'),
  require('../routes/thresholds-data'),
  require('../routes/stations-health'),
  require('../routes/telemetry-health'),
  require('../routes/ffoi-health'),
  require('../routes/stations-overview')
)

module.exports = {
  plugin: {
    name: 'router',
    register: server => {
      server.route(routes)
    }
  }
}
