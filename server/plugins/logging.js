const isProd = require('../config').isProd

module.exports = {
  plugin: require('@hapi/good'),
  options: {
    ops: {
      interval: 1000
    },
    reporters: {
      console: [
        {
          module: '@hapi/good-squeeze',
          name: 'Squeeze',
          args: [
            {
              log: isProd ? 'error' : '*',
              error: '*',
              response: isProd ? 'error' : '*',
              request: isProd ? 'error' : '*'
            }
          ]
        },
        {
          module: '@hapi/good-console'
        },
        'stdout'
      ]
    }
  }
}
