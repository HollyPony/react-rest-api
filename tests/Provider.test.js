/* eslint-disable react/display-name */
import React, { useContext } from 'react'
import { renderHook } from '@testing-library/react-hooks'

import { ApiContext, ApiProvider } from '../src'
import { mockSuccess, mockFail } from './fetch.mock'

const callbackSuccess = jest.fn().mockImplementation(() => {})
const callbackError = jest.fn().mockImplementation(() => {})

const setupFetch = async (fetchParams = [], providerOptions) => {
  const { result: { current: api } } = renderHook(() => useContext(ApiContext), {
    wrapper: ({ ...props }) => <ApiProvider {...props} {...providerOptions} />
  })

  callbackSuccess.mockReset()
  callbackError.mockReset()

  await api.fetch(...fetchParams)
    .then(callbackSuccess)
    .catch(callbackError)
}

describe('fetch with provider with url', () => {
  const providerProps = {
    url: 'https://localhost'
  }

  it('should get defined url', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    await setupFetch([''], providerProps)

    expect(window.fetch).toHaveBeenCalledWith('https://localhost', {})
    expect(callbackSuccess).toHaveBeenNthCalledWith(1, expect.objectContaining({
      ok: true,
      status: 200,
      url: 'https://localhost',
      json: expect.any(Function)
    }))
    expect(callbackError).not.toHaveBeenCalled()
  })

  it('should get fail', async () => {
    expect.hasAssertions()

    window.fetch = mockFail('nok')

    await setupFetch([''], providerProps)

    expect(window.fetch).toHaveBeenCalledWith('https://localhost', {})
    expect(callbackSuccess).not.toHaveBeenCalled()
    expect(callbackError).toHaveBeenNthCalledWith(1, expect.any(TypeError))
  })

  it('should merge path', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    await setupFetch(
      ['/path'],
      providerProps)

    expect(window.fetch).toHaveBeenCalledWith('https://localhost/path', {})
    expect(callbackSuccess).toHaveBeenNthCalledWith(1, expect.objectContaining({
      ok: true,
      status: 200,
      url: 'https://localhost/path',
      json: expect.any(Function)
    }))
    expect(callbackError).not.toHaveBeenCalled()
  })

  it('should merge path with query url params', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    await setupFetch(
      ['/path', undefined, { param: 'val' }],
      providerProps)

    expect(window.fetch).toHaveBeenCalledWith('https://localhost/path?param=val', {})
    expect(callbackSuccess).toHaveBeenNthCalledWith(1, expect.objectContaining({
      ok: true,
      status: 200,
      url: 'https://localhost/path?param=val',
      json: expect.any(Function)
    }))
    expect(callbackError).not.toHaveBeenCalled()
  })

  it('should add header', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    await setupFetch(
      ['/path', { headers: { 'Content-Type': 'application/json' } }],
      providerProps)

    expect(window.fetch).toHaveBeenCalledWith('https://localhost/path', { headers: { 'Content-Type': 'application/json' } })
    expect(callbackSuccess).toHaveBeenNthCalledWith(1, expect.objectContaining({
      ok: true,
      status: 200,
      url: 'https://localhost/path',
      json: expect.any(Function)
    }))
    expect(callbackError).not.toHaveBeenCalled()
  })
})

describe('fetch with provider with Content-Type header', () => {
  const providerProps = {
    config: {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }

  it('should call with provided headers', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    await setupFetch([''], providerProps)

    expect(window.fetch).toHaveBeenCalledWith('', { headers: { 'Content-Type': 'application/json' } })
    expect(callbackSuccess).toHaveBeenNthCalledWith(1, expect.objectContaining({
      ok: true,
      status: 200,
      url: '',
      json: expect.any(Function)
    }))
    expect(callbackError).not.toHaveBeenCalled()
  })

  it('should overrides header', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    await setupFetch(['', { headers: { 'Content-Type': 'application/xml' } }], providerProps)

    expect(window.fetch).toHaveBeenCalledWith('', { headers: { 'Content-Type': 'application/xml' } })
    expect(callbackSuccess).toHaveBeenNthCalledWith(1, expect.objectContaining({
      ok: true,
      status: 200,
      url: '',
      json: expect.any(Function)
    }))
    expect(callbackError).not.toHaveBeenCalled()
  })

  it('should add header', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    await setupFetch(['', { headers: { 'X-Api-Key': 1234 } }], providerProps)

    expect(window.fetch).toHaveBeenCalledWith('', { headers: { 'Content-Type': 'application/json', 'X-Api-Key': 1234 } })
    expect(callbackSuccess).toHaveBeenNthCalledWith(1, expect.objectContaining({
      ok: true,
      status: 200,
      url: '',
      json: expect.any(Function)
    }))
    expect(callbackError).not.toHaveBeenCalled()
  })
})
