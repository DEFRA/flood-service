const getQuery = require('../../server/services/getQuery')

describe('getQuery tests', () => {
  test('should return query if it exists', () => {
    const query = getQuery('getFloods')
    console.log('query:', query)
    expect(query).toBeString()
  })
  test('should throw error if it does not exist', () => {
    expect(() => getQuery('nosuchquery')).toThrow("query 'nosuchquery' not found")
  })
})
