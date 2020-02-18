import React, { createContext } from 'react'
import { buildParams } from './helper'

const _raw = (_endpoint, _config) => fetch(_endpoint, _config)

const _fetch = (_endpoint, _params, _config) => _raw(`${_endpoint || ''}${buildParams(_params)}`, _config)

const _fetchJson = (_endpoint, _params, _config = {}) => _fetch(_endpoint, _params, {
  ..._config,
  headers: {
    'Content-Type': 'application/json',
    ..._config.headers
  },
  body: _config.body
    ? _config._rawBody
      ? _config.body
      : JSON.stringify(_config.body)
    : undefined
})

const _get = (_endpoint, _params, _config = {}) => _fetch(_endpoint, _params, { method: 'GET', ..._config })
const _getJson = (_endpoint, _params, _config = {}) => _fetchJson(_endpoint, _params, { method: 'GET', ..._config }).then(res => res.json())
const _post = (_endpoint, _params, _config = {}) => _fetch(_endpoint, _params, { method: 'POST', ..._config })
const _postJson = (_endpoint, _params, _config = {}) => _fetchJson(_endpoint, _params, { method: 'POST', ..._config }).then(res => res.json())
const _put = (_endpoint, _params, _config = {}) => _fetch(_endpoint, _params, { method: 'PUT', ..._config })
const _putJson = (_endpoint, _params, _config = {}) => _fetchJson(_endpoint, _params, { method: 'PUT', ..._config }).then(res => res.json())
const _del = (_endpoint, _params, _config = {}) => _fetch(_endpoint, _params, { method: 'DELETE', ..._config })
const _delJson = (_endpoint, _params, _config = {}) => _fetchJson(_endpoint, _params, { method: 'DELETE', ..._config }).then(res => res.json())

const api = {
  raw: _raw,
  fetch: _fetch,
  fetchJson: _fetchJson,
  get: _get,
  getJson: _getJson,
  post: _post,
  postJson: _postJson,
  put: _put,
  putJson: _putJson,
  del: _del,
  delJson: _delJson
}

export const ApiContext = createContext(api)

export const ApiConsumer = ApiContext.Consumer

export const ApiProvider = ({
  children,
  url = '',
  config = {},
  resolveCallback = response => Promise.resolve(response),
  rejectCallback = response => Promise.reject(response)
}) => {
  const fetch = (_endpoint = '', _params, _config = {}) => _raw(
    `${url || ''}${_endpoint}${buildParams(_params)}`,
    {
      ...config,
      ..._config,
      headers: (config.headers || _config.headers) && {
        ...config.headers,
        ..._config.headers
      }
    })
    .then(resolveCallback)
    .catch(rejectCallback)

  const fetchJson = (_endpoint, _params, _config = {}) => fetch(_endpoint, _params, {
    ..._config,
    headers: {
      'Content-Type': 'application/json',
      ..._config.headers
    },
    body: _config.body
      ? _config._rawBody
        ? _config.body
        : JSON.stringify(_config.body)
      : undefined
  })

  const get = (_endpoint, _params, _config = {}) => fetch(_endpoint, _params, { method: 'GET', ..._config })
  const getJson = (_endpoint, _params, _config = {}) => fetchJson(_endpoint, _params, { method: 'GET', ..._config }).then(res => res.json())
  const post = (_endpoint, _params, _config = {}) => fetch(_endpoint, _params, { method: 'POST', ..._config })
  const postJson = (_endpoint, _params, _config = {}) => fetchJson(_endpoint, _params, { method: 'POST', ..._config }).then(res => res.json())
  const put = (_endpoint, _params, _config = {}) => fetch(_endpoint, _params, { method: 'PUT', ..._config })
  const putJson = (_endpoint, _params, _config = {}) => fetchJson(_endpoint, _params, { method: 'PUT', ..._config }).then(res => res.json())
  const del = (_endpoint, _params, _config = {}) => fetch(_endpoint, _params, { method: 'DELETE', ..._config })
  const delJson = (_endpoint, _params, _config = {}) => fetchJson(_endpoint, _params, { method: 'DELETE', ..._config }).then(res => res.json())

  const value = {
    raw: _raw,
    fetch,
    fetchJson,
    get,
    getJson,
    post,
    postJson,
    put,
    putJson,
    del,
    delJson
  }

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>
}

