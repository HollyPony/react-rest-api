import React, { createContext, useContext } from 'react'

export const ApiContext = createContext()

export const ApiProvider = ({
  url = '',
  config = {},
  resolveHook = res => Promise.resolve(res),
  rejectHook = res => Promise.reject(res),
  children
}) => {
  function proxy (endpoint, queryConfig, params, options = {}) {
    return fetch(
      `${options.url === undefined ? url : options.url}${options.endpoint === undefined ? endpoint : options.endpoint}${objectToQuery(params)}`,
      mergeConfig(config, queryConfig),
    )
      .then(options.resolveHook || resolveHook)
      .catch(options.rejectHook || rejectHook)
  }

  return React.createElement(ApiContext.Provider, {
    value: {
      url,
      config,
      fetch: proxy,
      get: (endpoint, config = {}, params, options) => proxy(endpoint, { method: 'GET', ...config }, params, options),
      post: (endpoint, config = {}, params, options) => proxy(endpoint, { method: 'POST', ...config }, params, options),
      put: (endpoint, config = {}, params, options) => proxy(endpoint, { method: 'PUT', ...config }, params, options),
      del: (endpoint, config = {}, params, options) => proxy(endpoint, { method: 'DELETE', ...config }, params, options)
    }
  }, children)
}

export const useApi = () => useContext(ApiContext)

export function mergeConfig (apiConfig = {}, queryConfig = {}) {
  return {
    ...removeUndefineds({
      ...apiConfig,
      ...queryConfig
    }),
    headers: removeUndefineds({
      ...(apiConfig.headers || {}),
      ...(queryConfig.headers || {})
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

export function removeUndefineds (obj) {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key] !== undefined) { acc[key] = obj[key] }
    return acc
  }, {})
}
