export function buildParams (obj) {
  if (!obj || obj.length === 0) {
    return ''
  }
  return `?${Object.entries(obj).reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(arrItm => acc.append(`${key}[]`, arrItm))
    } else if (value !== undefined && typeof value !== 'object') {
      acc.append(key, value)
    }
    return acc
  }, new URLSearchParams())}`
}
