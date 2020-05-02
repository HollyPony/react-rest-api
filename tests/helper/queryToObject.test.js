import { queryToObject } from '../../src'

describe('helper', () => {
  describe('queryToObject', () => {
    it('should be empty string when nothing', () => {
      expect.hasAssertions()
      expect(queryToObject())
        .toStrictEqual({})
    })

    it('should be empty string when no descriptors', () => {
      expect.hasAssertions()
      const date = new Date()
      expect(queryToObject(`?id=1&value=string&date=${date.toISOString()}`))
        .toStrictEqual({})
    })

    it('should be empty string when empty values', () => {
      expect.hasAssertions()
      expect(queryToObject('?id=&value=&date=', { id: {}, value: {}, date: {} }))
        .toStrictEqual({ id: '', date: '', value: '' })
    })

    it('should be empty string when typed empty values', () => {
      expect.hasAssertions()
      expect(queryToObject('?id=&value=&date=', { id: { type: 'number' }, value: {}, date: { type: 'date' } }))
        .toStrictEqual({ id: 0, date: '', value: '' })
    })

    it('should be empty string when missing descriptors', () => {
      expect.hasAssertions()
      const date = new Date()
      expect(queryToObject(`?id=1&value=string&date=${date.toISOString()}`, { id: {} }))
        .toStrictEqual({ id: '1' })
    })

    it('should be empty string when extra descriptors', () => {
      expect.hasAssertions()
      const date = new Date()
      expect(queryToObject(`?id=1&value=string&date=${date.toISOString()}`, { id: {}, extra: {} }))
        .toStrictEqual({ id: '1' })
    })

    it('should be empty string when not describe types', () => {
      expect.hasAssertions()
      const date = new Date()
      expect(queryToObject(`?id=1&value=string&date=${date.toISOString()}`, { id: {}, value: {} }))
        .toStrictEqual({ id: '1', value: 'string' })
    })

    it('should be empty string when has types', () => {
      expect.hasAssertions()
      const date = new Date()
      expect(queryToObject(`?id=1&value=string&date=${date.toISOString()}`, { id: { type: 'number' }, value: {}, date: { type: 'date' } }))
        .toMatchObject({ id: 1, value: 'string', date })
    })

    it('should be empty string when has same keys', () => {
      expect.hasAssertions()
      const date = new Date()
      expect(queryToObject(`?id=1&value=string&value=string2&date=${date.toISOString()}`, { id: { type: 'number' }, value: {}, date: { type: 'date' } }))
        .toMatchObject({ id: 1, value: 'string', date })
    })

    it('should be empty string when has array key', () => {
      expect.hasAssertions()
      const date = new Date()
      expect(queryToObject(`?id=1&value=string&value=string2&date=${date.toISOString()}`, { id: { type: 'number' }, value: { array: true }, date: { type: 'date' } }))
        .toMatchObject({ id: 1, value: ['string', 'string2'], date })
    })

    it('should be empty string when has array formatted key', () => {
      expect.hasAssertions()
      const date = new Date()
      expect(queryToObject(`?id=1&value=string&value=3&date=${date.toISOString()}`, { id: { type: 'number' }, value: { array: true, type: 'number' }, date: { type: 'date' } }))
        .toMatchObject({ id: 1, value: [NaN, 3], date })
    })
  })
})
