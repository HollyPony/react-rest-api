import { buildParams } from '../src'

describe('helper', () => {
  describe('buildParams', () => {
    it('should be empty string when undefined', () => {
      expect.hasAssertions()
      expect(buildParams())
        .toBe('')
    })

    it('should be empty string when empty object', () => {
      expect.hasAssertions()
      expect(buildParams({}))
        .toBe('')
    })

    it('should be valid queryString when object with string', () => {
      expect.hasAssertions()
      expect(buildParams({ param1: 'val1' }))
        .toBe('?param1=val1')
    })

    it('should be valid queryString when object with int', () => {
      expect.hasAssertions()
      expect(buildParams({ param1: 1 }))
        .toBe('?param1=1')
    })

    it('should be valid queryString when object with bool', () => {
      expect.hasAssertions()
      expect(buildParams({ param1: true, param2: false }))
        .toBe('?param1=true&param2=false')
    })

    it('should be valid queryString when object with zero', () => {
      expect.hasAssertions()
      expect(buildParams({ param1: 0 }))
        .toBe('?param1=0')
    })

    it('should be valid queryString when object with array', () => {
      expect.hasAssertions()
      expect(buildParams({ a: ['x', 18] }))
        .toBe('?a%5B%5D=x&a%5B%5D=18')
    })

    it('should be valid queryString when object with empty array', () => {
      expect.hasAssertions()
      expect(buildParams({ a: [] }))
        .toBe('?a%5B%5D=')
    })

    it('should be valid queryString when object mix array and string', () => {
      expect.hasAssertions()
      expect(buildParams({ a: ['x'], hey: 'ho' }))
        .toBe('?a%5B%5D=x&hey=ho')
    })

    it('should be valid queryString when object mix array and integer', () => {
      expect.hasAssertions()
      expect(buildParams({ a: ['x'], hey: 5 }))
        .toBe('?a%5B%5D=x&hey=5')
    })

    it('should be valid queryString when object mix empty array and string', () => {
      expect.hasAssertions()
      expect(buildParams({ a: [], hey: 'ho' }))
        .toBe('?a%5B%5D=&hey=ho')
    })

    it('should be Error when string', () => {
      expect.hasAssertions()
      expect(() => buildParams('hey'))
        .toThrow('buildParams value should be an Object')
    })

    it('should be Error when empty string', () => {
      expect.hasAssertions()
      expect(() => buildParams(''))
        .toThrow('buildParams value should be an Object')
    })

    it('should be Error when  array', () => {
      expect.hasAssertions()
      expect(() => buildParams(['hey']))
        .toThrow('buildParams value should be an Object')
    })

    it('should be Error when  empty array', () => {
      expect.hasAssertions()
      expect(() => buildParams([]))
        .toThrow('buildParams value should be an Object')
    })

    it('should be Error when  array of object', () => {
      expect.hasAssertions()
      expect(() => buildParams([{}]))
        .toThrow('buildParams value should be an Object')
    })
  })
})
