import React, { createContext, useContext, useRef } from 'react'

export const ApiContext = createContext()
export const ApiProvider = ({
  url: initialUrl = '',
  config: initialConf,
  resolveCallback = res => Promise.resolve(res),
  rejectCallback = res => Promise.reject(res),
  children
}) => {
  const url = useRef(initialUrl)
  const config = useRef(initialConf)

  const proxy = (endpoint, _config, _params) =>
    fetch(`${url.current}${endpoint}${objectToQuery(_params)}`, buildConfig(config.current, _config))
      .then(resolveCallback)
      .catch(rejectCallback)

  return React.createElement(ApiContext.Provider, {
    value: {
      setUrl: (newUrl = {}) => { url.current = newUrl },
      setConfig: (newConfig = {}) => { config.current = newConfig },
      fetch: proxy,
      get: (endpoint, conf = {}, params) => proxy(endpoint, { method: 'GET', ...conf }, params),
      post: (endpoint, conf = {}, params) => proxy(endpoint, { method: 'POST', ...conf }, params),
      put: (endpoint, conf = {}, params) => proxy(endpoint, { method: 'PUT', ...conf }, params),
      del: (endpoint, conf = {}, params) => proxy(endpoint, { method: 'DELETE', ...conf }, params)
    }
  }, children)
}

export const useApi = () => useContext(ApiContext)

function buildConfig (oldConfig = {}, newConfig = {}) {
  return {
    ...removeUndefineds({
      ...oldConfig,
      ...newConfig
    }),
    headers: removeUndefineds({
      ...(oldConfig.headers || {}),
      ...(newConfig.headers || {})
    })
  }
}

export function objectToQuery (obj = {}) {
  if (Array.isArray(obj) || typeof obj === 'string') throw new Error('objectToQuery value should be an Object')

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

export function removeUndefineds (obj) {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key] !== undefined) { acc[key] = obj[key] }
    return acc
  }, {})
}

function toObjectValue (value, type) {
  switch (type) {
    case 'number': return Number(value)
    case 'date': return isNaN(Date.parse(value)) ? value : new Date(value)
    default: return value
  }
}
