// 'use strict'

// const Lab = require('@hapi/lab')
// const Code = require('code')
// const lab = exports.lab = Lab.script()
// const sinon = require('sinon')
// // const services = require('../../server/services/index.js')
// // const util = require('../../server/util')

// lab.experiment('location service test', () => {
//   let sandbox
//   // Use a Sinon sandbox to manage spies, stubs and mocks for each test.
//   lab.beforeEach(async () => {
//     sandbox = await sinon.createSandbox()
//   })
//   lab.afterEach(async () => {
//     await sandbox.restore()
//   })
//   // lab.test('Check location service exists', () => {
//   //   Code.expect(services).to.be.a.object()
//   // })
//   lab.test('Check getfloods service', async () => {
//     const getFloods = () => {
//       return {
//         floods:
//         {
//           code: '061WAF07Cole',
//           key: 175364,
//           description: 'River Cole and Dorcan Brook',
//           quickdialnumber: '171235',
//           region: 'South East',
//           area: 'West Thames',
//           floodtype: 'f',
//           severity: 3,
//           severitydescription: 'Flood Alert',
//           warningkey: 106274,
//           raised: '2019-07-24T06:17:00.000Z',
//           severitychanged: '2019-07-24T06:17:00.000Z',
//           messagechanged: '2019-07-24T06:17:00.000Z',
//           message: 'Property flooding is not currently expected.\nRiver levels have risen on the River Cole at Lower Stratton as a result of thunderstorms overnight. River levels have peaked and are expected to start falling soon, with no further rise forecasted.\nOur incident response staff are monitoring the situation. This message will be updated this afternoon',
//           geometry: '{\'type:\'Point\',\'coordinates:[-1.69232110253823,51.6047668691946]}'
//         },
//         timestamp: '1563969242'
//       }
//     }

//     //sandbox.stub(services, 'pool').callsFake(getFloods)

//     const services = require('../../server/services/index.js')

//     const result = services.getFloods()

//     console.log(result)

//     await Code.expect(result).to.be.a.object()
//   })
// })
