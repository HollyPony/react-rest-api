/* eslint-disable react/display-name */
/* eslint-disable jest/expect-expect */
import React, { useContext } from 'react'
import { render, wait } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'

import { ApiContext, ApiProvider, ApiConsumer, useApi, buildParams } from '../src'
import { mockSuccess, mockFail } from './fetch.mock'

const apiFcts = {
  get: {
    expectCalledWith: ({ url: providerUrl, config: providerConfig = {} }, { url, params, config = {} }) => [
      `${providerUrl || ''}${url || ''}${buildParams(params)}`,
      {
        ...providerConfig,
        ...config,
        method: 'GET',
        headers: (providerConfig.headers || config.headers) && {
          ...providerConfig.headers,
          ...config.headers
        }
      }],
    expectSuccess: ({ url: providerUrl }, { url, params }) => [expect.objectContaining({
      ok: true,
      status: 200,
      url: `${providerUrl || ''}${url || ''}${buildParams(params)}`,
      json: expect.any(Function)
    })]
  },
  post: {
    expectCalledWith: ({ url: providerUrl, config: providerConfig = {} }, { url, params, config = {} }) => [
      `${providerUrl || ''}${url || ''}${buildParams(params)}`,
      {
        ...providerConfig,
        ...config,
        method: 'POST',
        headers: (providerConfig.headers || config.headers) && {
          ...providerConfig.headers,
          ...config.headers
        }
      }],
    expectSuccess: ({ url: providerUrl }, { url, params }) => [expect.objectContaining({
      ok: true,
      status: 200,
      url: `${providerUrl || ''}${url || ''}${buildParams(params)}`,
      json: expect.any(Function)
    })]
  },
  put: {
    expectCalledWith: ({ url: providerUrl, config: providerConfig = {} }, { url, params, config = {} }) => [
      `${providerUrl || ''}${url || ''}${buildParams(params)}`,
      {
        ...providerConfig,
        ...config,
        method: 'PUT',
        headers: (providerConfig.headers || config.headers) && {
          ...providerConfig.headers,
          ...config.headers
        }
      }],
    expectSuccess: ({ url: providerUrl }, { url, params }) => [expect.objectContaining({
      ok: true,
      status: 200,
      url: `${providerUrl || ''}${url || ''}${buildParams(params)}`,
      json: expect.any(Function)
    })]
  },
  del: {
    expectCalledWith: ({ url: providerUrl, config: providerConfig = {} }, { url, params, config = {} }) => [
      `${providerUrl || ''}${url || ''}${buildParams(params)}`,
      {
        ...providerConfig,
        ...config,
        method: 'DELETE',
        headers: (providerConfig.headers || config.headers) && {
          ...providerConfig.headers,
          ...config.headers
        }
      }],
    expectSuccess: ({ url: providerUrl }, { url, params }) => [expect.objectContaining({
      ok: true,
      status: 200,
      url: `${providerUrl || ''}${url || ''}${buildParams(params)}`,
      json: expect.any(Function)
    })]
  },
  getJson: {
    expectCalledWith: ({ url: providerUrl, config: providerConfig = {} }, { url, params, config = {} }) => {
      return [
      `${providerUrl || ''}${url || ''}${buildParams(params)}`,
      {
        ...providerConfig,
        ...config,
        method: 'GET',
        headers: {
          ...providerConfig.headers,
          ...config.headers,
          'Content-Type': 'application/json'
        },
        body: config.body ? config._rawBody ? config.body : JSON.stringify(config.body) : undefined
      }]
    },
    expectSuccess: (dump, { calledWith }) => [expect.objectContaining(calledWith)]
  },
  postJson: {
    expectCalledWith: ({ url: providerUrl, config: providerConfig = {} }, { url, params, config = {} }) => [
      `${providerUrl || ''}${url || ''}${buildParams(params)}`,
      {
        ...providerConfig,
        ...config,
        method: 'POST',
        headers: {
          ...providerConfig.headers,
          ...config.headers,
          'Content-Type': 'application/json'
        },
        body: config.body ? config._rawBody ? config.body : JSON.stringify(config.body) : undefined
      }],
    expectSuccess: (dump, { calledWith }) => [expect.objectContaining(calledWith)]
  },
  putJson: {
    expectCalledWith: ({ url: providerUrl, config: providerConfig = {} }, { url, params, config = {} }) => [
      `${providerUrl || ''}${url || ''}${buildParams(params)}`,
      {
        ...providerConfig,
        ...config,
        method: 'PUT',
        headers: {
          ...providerConfig.headers,
          ...config.headers,
          'Content-Type': 'application/json'
        },
        body: config.body ? config._rawBody ? config.body : JSON.stringify(config.body) : undefined
      }],
    expectSuccess: (dump, { calledWith }) => [expect.objectContaining(calledWith)]
  },
  delJson: {
    expectCalledWith: ({ url: providerUrl, config: providerConfig = {} }, { url, params, config = {} }) => [
      `${providerUrl || ''}${url || ''}${buildParams(params)}`,
      {
        ...providerConfig,
        ...config,
        method: 'DELETE',
        headers: {
          ...providerConfig.headers,
          ...config.headers,
          'Content-Type': 'application/json'
        },
        body: config.body ? config._rawBody ? config.body : JSON.stringify(config.body) : undefined
      }],
    expectSuccess: (dump, { calledWith }) => [expect.objectContaining(calledWith)]
  }
}

async function withConsumer (renderOptions, {
  method,
  callbackSuccess,
  callbackError,
  url,
  params,
  config
}) {
  render(
    <ApiConsumer>{api => {
      api[method](url, params, config)
        .then(callbackSuccess)
        .catch(callbackError)
      return ''
    }}
    </ApiConsumer>, renderOptions)
  await wait()
}

async function withUseContext (renderOptions, {
  method,
  callbackSuccess,
  callbackError,
  url,
  params,
  config
}) {
  const { result: { current: api } } = renderHook(() => useContext(ApiContext), renderOptions)

  await api[method](url, params, config)
    .then(callbackSuccess)
    .catch(callbackError)
}

async function withUseApi (renderOptions, {
  method,
  callbackSuccess,
  callbackError,
  url,
  params,
  config
}) {
  const { result, waitForNextUpdate } = renderHook(() => useApi(method, url, params, config), renderOptions)

  return waitForNextUpdate().then(() => {
    if (result.current.error) {
      callbackError(result.current.error)
    }
    if (result.current.result) {
      callbackSuccess(result.current.result)
    }
  })
}

async function testSuccess (method, render, provider, { url, params, config } = {}) {
  expect.hasAssertions()
  const calledWith = { test: 'thing' }

  window.fetch = mockSuccess(calledWith)

  const callbackSuccess = jest.fn().mockImplementation(() => {})
  const callbackError = jest.fn().mockImplementation(() => {})

  await render(provider.renderOptions, {
    method,
    callbackSuccess,
    callbackError,
    url,
    params,
    config
  })

  expect(window.fetch).toHaveBeenCalledWith(...apiFcts[method].expectCalledWith(provider.options, { url, params, config }))
  expect(callbackSuccess).toHaveBeenNthCalledWith(1, ...apiFcts[method].expectSuccess(provider.options, { url, params, config, calledWith }))
  expect(callbackError).not.toHaveBeenCalled()
}

async function testFail (method, render, provider, { url, params, config } = {}) {
  expect.hasAssertions()

  window.fetch = mockFail('nok')
  const callbackSuccess = jest.fn().mockImplementation(() => {})
  const callbackError = jest.fn().mockImplementation(() => {})

  await render(provider.renderOptions, {
    method,
    callbackSuccess,
    callbackError,
    url,
    params,
    config
  })

  expect(window.fetch).toHaveBeenCalledWith(...apiFcts[method].expectCalledWith(provider.options, { url, params, config }))
  expect(callbackSuccess).not.toHaveBeenCalled()
  expect(callbackError).toHaveBeenNthCalledWith(1, expect.any(TypeError))
}

const renderers = [{
  name: 'render Consumer',
  fct: withConsumer
}, {
  name: 'render useContext',
  fct: withUseContext
}, {
  name: 'render useApi',
  fct: withUseApi
}]

const providers = [{
  name: 'without Provider',
  options: {},
  renderOptions: {}
}, {
  name: 'providing empty url',
  options: {},
  renderOptions: {
    wrapper: (props) => <ApiProvider {...props} />
  }
}, {
  name: 'providing url',
  options: { url: 'http://myHost' },
  renderOptions: {
    wrapper: (props) => <ApiProvider url='http://myHost' {...props} />
  }
}, {
  name: 'providing config',
  options: {
    config: {
      headers: {
        'X-MyApi-Key': '123456789'
      }
    }
  },
  renderOptions: {
    wrapper: (props) =>
      <ApiProvider
        config={{
          headers: {
            'X-MyApi-Key': '123456789'
          }
        }} {...props}
      />
  }
}, {
  name: 'providing url and config',
  options: {
    url: 'http://myHost',
    config: {
      headers: {
        'X-MyApi-Key': '123456789'
      }
    }
  },
  renderOptions: {
    wrapper: (props) =>
      <ApiProvider
        url='http://myHost'
        config={{
          headers: {
            'X-MyApi-Key': '123456789'
          }
        }} {...props}
      />
  }
}]

const states = [{
  name: 'success',
  callback: testSuccess
}, {
  name: 'network fail (TypeError)',
  callback: testFail
}]

renderers.forEach(renderer => {
  describe(`${renderer.name}`, () => {
    Object.keys(apiFcts).forEach(key => {
      describe(`api.${key}`, () => {
        providers.forEach(provider => {
          describe(`${provider.name}`, () => {
            states.forEach(state => {
              describe(`${state.name}`, () => {
                it('without params', () => state.callback(key, renderer.fct, provider))
                it('with url', () => state.callback(key, renderer.fct, provider, { url: 'http://google.com' }))
                it('with params', () => state.callback(key, renderer.fct, provider, {
                  params: { param1: 'val' }
                }))
                it('with json body', () => state.callback(key, renderer.fct, provider, {
                  config: { body: { myKey: 'myValue' } }
                }))
                it('with json body raw', () => state.callback(key, renderer.fct, provider, {
                  config: {
                    _rawBody: true,
                    body: { myKey: 'myValue' }
                  }
                }))
                it('with url and body', () => state.callback(key, renderer.fct, provider, {
                  params: { myParam: 'myValue', myBool: true },
                  config: {
                    body: { myKey: 'myValue' }
                  }
                }))
                it('with url and body raw', () => state.callback(key, renderer.fct, provider, {
                  params: { myParam: 'myValue', myBool: true },
                  config: {
                    _rawBody: true,
                    body: { myKey: 'myValue' }
                  }
                }))
                it('with custom header', () => state.callback(key, renderer.fct, provider, {
                  params: { myParam: 'myValue', myBool: true },
                  config: {
                    headers: {
                      'X-MyApi-Key': '0987654321'
                    }
                  }
                }))
              })
            })
          })
        })
      })
    })
  })
})
