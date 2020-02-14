export function buildParams (obj = {}) {
  if (Array.isArray(obj) || typeof obj === 'string') throw new Error('buildParams value should be an Object')

  const queryUrl = Object.entries(obj).reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        acc.append(`${key}[]`, '')
      } else {
        value.forEach(arrItm => acc.append(`${key}[]`, arrItm))
      }
    } else if (value !== undefined && typeof value !== 'object') {
      acc.append(key, value)
    }
    return acc
  }, new URLSearchParams()).toString()

  return queryUrl ? `?${queryUrl}` : ''
}
