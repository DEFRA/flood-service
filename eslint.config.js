'use strict'

module.exports = [
  ...require('neostandard')({
    env: ['jest']
  }),
  {
    languageOptions: {
      parserOptions: {
        requireConfigFile: false
      }
    }
  }
]
