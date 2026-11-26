'use strict'

const mockPoolQuery = jest.fn()

jest.mock('pg', () => ({
  Pool: jest.fn(() => ({ query: (...args) => mockPoolQuery(...args) }))
}))
jest.mock('../../server/services/getQuery', () => jest.fn(name => `SQL for ${name}`))

const db = require('../../server/services/db')

describe('db service', () => {
  test('query runs the named query through the pool with its arguments', async () => {
    mockPoolQuery.mockResolvedValue({ rows: [{ id: 1 }] })

    const result = await db.query('getStation', [1, 'u'])

    expect(mockPoolQuery).toHaveBeenCalledWith('SQL for getStation', [1, 'u'])
    expect(result).toEqual({ rows: [{ id: 1 }] })
  })
})
