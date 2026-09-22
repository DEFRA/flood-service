'use strict'

module.exports = [
  ...require('neostandard')({}),
  {
    languageOptions: {
      parserOptions: {
        requireConfigFile: false
      }
    }
  }
]
