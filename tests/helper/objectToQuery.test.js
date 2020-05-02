import { objectToQuery } from '../../src'

describe('helper', () => {
  describe('objectToQuery', () => {
    it('should be empty string when undefined', () => {
      expect.hasAssertions()
      expect(objectToQuery())
        .toBe('')
    })

    it('should be empty string when empty object', () => {
      expect.hasAssertions()
      expect(objectToQuery({}))
        .toBe('')
    })

    it('should be valid queryString when object with string', () => {
      expect.hasAssertions()
      expect(objectToQuery({ param1: 'val1' }))
        .toBe('?param1=val1')
    })

    it('should be valid queryString when object with int', () => {
      expect.hasAssertions()
      expect(objectToQuery({ param1: 1 }))
        .toBe('?param1=1')
    })

    it('should be valid queryString when object with bool', () => {
      expect.hasAssertions()
      expect(objectToQuery({ param1: true, param2: false }))
        .toBe('?param1=true&param2=false')
    })

    it('should be valid queryString when object with zero', () => {
      expect.hasAssertions()
      expect(objectToQuery({ param1: 0 }))
        .toBe('?param1=0')
    })

    it('should be valid queryString when object with array', () => {
      expect.hasAssertions()
      expect(objectToQuery({ a: ['x', 18] }))
        .toBe('?a=x&a=18')
    })

    it('should be valid queryString when object with empty array', () => {
      expect.hasAssertions()
      expect(objectToQuery({ a: [] }))
        .toBe('?a=')
    })

    it('should be valid queryString when object mix array and string', () => {
      expect.hasAssertions()
      expect(objectToQuery({ a: ['x'], hey: 'ho' }))
        .toBe('?a=x&hey=ho')
    })

    it('should be valid queryString when object mix array and integer', () => {
      expect.hasAssertions()
      expect(objectToQuery({ a: ['x'], hey: 5 }))
        .toBe('?a=x&hey=5')
    })

    it('should be valid queryString when object has date', () => {
      expect.hasAssertions()
      const date = new Date()
      expect(objectToQuery({ date }))
        .toBe(`?date=${encodeURIComponent(date.toISOString())}`)
    })

    it('should be valid queryString when object mix empty array and string', () => {
      expect.hasAssertions()
      expect(objectToQuery({ a: [], hey: 'ho' }))
        .toBe('?a=&hey=ho')
    })

    it('should be valid queryString when object has [] syntax for array', () => {
      expect.hasAssertions()
      expect(objectToQuery({ 'a[]': [1], hey: 'ho' }))
        .toBe('?a%5B%5D=1&hey=ho')
    })

    it('should be Error when string', () => {
      expect.hasAssertions()
      expect(() => objectToQuery('hey'))
        .toThrow('objectToQuery value should be an Object')
    })

    it('should be Error when empty string', () => {
      expect.hasAssertions()
      expect(() => objectToQuery(''))
        .toThrow('objectToQuery value should be an Object')
    })

    it('should be Error when  array', () => {
      expect.hasAssertions()
      expect(() => objectToQuery(['hey']))
        .toThrow('objectToQuery value should be an Object')
    })

    it('should be Error when  empty array', () => {
      expect.hasAssertions()
      expect(() => objectToQuery([]))
        .toThrow('objectToQuery value should be an Object')
    })

    it('should be Error when  array of object', () => {
      expect.hasAssertions()
      expect(() => objectToQuery([{}]))
        .toThrow('objectToQuery value should be an Object')
    })
  })
})
