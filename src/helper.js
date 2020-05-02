export function buildParams (obj = {}) {
  if (Array.isArray(obj) || typeof obj === 'string') throw new Error('buildParams value should be an Object')

  const queryUrl = Object.entries(obj).reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        acc.append(key, '')
      } else {
        value.forEach(arrItm => acc.append(key, arrItm))
      }
    } else if (value instanceof Date) {
      acc.append(key, value.toISOString())
    } else if (value !== undefined && typeof value !== 'object') {
      acc.append(key, value)
    }
    return acc
  }, new URLSearchParams()).toString()

  return queryUrl ? `?${queryUrl}` : ''
}

const toObjectValue = (value, type) => {
  switch (type) {
    case 'number': return Number(value)
    case 'date': return isNaN(Date.parse(value)) ? value : new Date(value)
    default: return value
  }
}

export const queryToObject = (search, descriptors = {}) => {
  const searchParams = new URLSearchParams(search)

  const params = Object.entries(descriptors).reduce((acc, [key, options]) => {
    if (searchParams.has(key)) {
      acc[key] = options.array
        ? searchParams.getAll(key).map(value => toObjectValue(value, options.type))
        : toObjectValue(searchParams.get(key), options.type)
    }
    return acc
  }, {})

  return params
}
export const _fetch = (_endpoint, { _stringifyBody, ..._conf } = {}) => fetch(_endpoint, _conf)

export const buildApi = ({
  url = '', config: conf = {},
  setUrl = () => { throw new Error('You should provide `setUrl` to <ApiProvider />') },
  setConfig = () => { throw new Error('You should provide `setConfig` to <ApiProvider />') },
  resolveCallback = res => Promise.resolve(res),
  rejectCallback = res => Promise.reject(res)
} = {}) => {
  const proxy = (_endpoint, _conf = {}, _params) => _fetch(
    `${url}${_endpoint || ''}${buildParams(_params)}`,
    {
      ...conf,
      ..._conf,
      headers: (conf.headers || _conf.headers) && {
        ...conf.headers,
        ..._conf.headers
      },
      body: (_conf.body || conf.body)
        ? (_conf._stringifyBody !== undefined ? _conf._stringifyBody : conf._stringifyBody)
          ? JSON.stringify(_conf.body || conf.body)
          : (_conf.body || conf.body)
        : undefined
    })
    .then(resolveCallback)
    .catch(rejectCallback)

  return {
    setUrl,
    setConfig,
    raw: _fetch,
    fetch: proxy,
    get: (_endpoint, _conf = {}, _params) => proxy(_endpoint, { method: 'GET', ..._conf }, _params),
    post: (_endpoint, _conf = {}, _params) => proxy(_endpoint, { method: 'POST', ..._conf }, _params),
    put: (_endpoint, _conf = {}, _params) => proxy(_endpoint, { method: 'PUT', ..._conf }, _params),
    del: (_endpoint, _conf = {}, _params) => proxy(_endpoint, { method: 'DELETE', ..._conf }, _params)
  }
}
