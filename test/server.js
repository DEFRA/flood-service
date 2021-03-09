'use strict'

const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()
const proxyquire = require('proxyquire')
const temp = process.exit

lab.experiment('Server fail test', () => {
  lab.before(() => {
    process.exit = () => {
      // restore mock after once
      process.exit = temp
    }
  })

  lab.after(() => {
    process.exit = temp
  })

  lab.test('test server init error', async () => {
    // no assertions, just inject error throw to hit process.exit functionality
    // if this unit test were to fail then the unit tests would process exit mid function
    await proxyquire('../index', {
      './server': () => {
        return new Promise((resolve, reject) => {
          return resolve({
            start: () => {
              return new Promise((resolve, reject) => {
                throw new Error('test error')
              })
            }
          })
        })
      }
    })
  })
})
