const Code = require('@hapi/code')
const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()
const getQuery = require('../../server/services/getQuery')

lab.experiment('getQuery tests', () => {
  lab.test('should return query if it exists', () => {
    const query = getQuery('getFloods')
    Code.expect(query).to.be.a.string()
  })
  lab.test('should throw error if it does not exist', () => {
    Code.expect(() => getQuery('nosuchquery')).to.throw("query 'nosuchquery' not found")
  })
})
