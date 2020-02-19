import React, { createContext } from 'react'
import { buildParams } from './helper'
const _raw = (_endpoint, { _stringifyBody, ..._config } = {}) => fetch(_endpoint, _config)

const _fetch = (_endpoint, _config = {}, _params) => _raw(
  `${_endpoint || ''}${buildParams(_params)}`,
  {
    ..._config,
    body: _config.body
      ? _config._stringifyBody
        ? JSON.stringify(_config.body)
        : _config.body
      : undefined
  })

const buildApi = proxyFetch => ({
  raw: _raw,
  fetch: proxyFetch,
  get: (_endpoint, _config = {}, _params) => proxyFetch(_endpoint, { method: 'GET', ..._config }, _params),
  post: (_endpoint, _config = {}, _params) => proxyFetch(_endpoint, { method: 'POST', ..._config }, _params),
  put: (_endpoint, _config = {}, _params) => proxyFetch(_endpoint, { method: 'PUT', ..._config }, _params),
  del: (_endpoint, _config = {}, _params) => proxyFetch(_endpoint, { method: 'DELETE', ..._config }, _params)
})

const _ApiProvider = ({
  children,
  url = '',
  config = {},
  resolveCallback = response => Promise.resolve(response),
  rejectCallback = response => Promise.reject(response)
}) => {
  const proxyFetch = (_endpoint = '', _config = {}, _params) => _fetch(
    `${url || ''}${_endpoint}`,
    {
      ...config,
      ..._config,
      headers: (config.headers || _config.headers) && {
        ...config.headers,
        ..._config.headers
      }
    }, _params)
    .then(resolveCallback)
    .catch(rejectCallback)

  return <ApiContext.Provider value={buildApi(proxyFetch)}>{children}</ApiContext.Provider>
}

export const ApiContext = createContext(buildApi(_fetch))
export const ApiConsumer = ApiContext.Consumer
export const withApi = Component => props => <ApiConsumer>{api => <Component {...props} api={api} />}</ApiConsumer>
export const ApiProvider = _ApiProvider
