/* eslint-disable react/display-name */
import React, { useContext } from 'react'
import { renderHook } from '@testing-library/react-hooks'

import { ApiContext, ApiProvider } from '../src'
import { mockSuccess, mockFail } from './fetch.mock'

const callbackSuccess = jest.fn().mockImplementation(() => {})
const callbackError = jest.fn().mockImplementation(() => {})

const setupFetch = async (fetchParams = [], renderOptions) => {
  const { result: { current: api } } = renderHook(() => useContext(ApiContext), renderOptions)

  callbackSuccess.mockReset()
  callbackError.mockReset()

  await api.put(...fetchParams)
    .then(callbackSuccess)
    .catch(callbackError)
}

describe('put', () => {
  it('should get', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    await setupFetch([''])

    expect(window.fetch).toHaveBeenCalledWith('', { method: 'PUT' })
    expect(callbackSuccess).toHaveBeenNthCalledWith(1, expect.objectContaining({
      ok: true,
      status: 200,
      url: '',
      json: expect.any(Function)
    }))
    expect(callbackError).not.toHaveBeenCalled()
  })

  it('should get with provider url', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    await setupFetch([''], {
      wrapper: ({ ...props }) => <ApiProvider {...props} url='https://localhost' />
    })

    expect(window.fetch).toHaveBeenCalledWith('https://localhost', { method: 'PUT' })
    expect(callbackSuccess).toHaveBeenNthCalledWith(1, expect.objectContaining({
      ok: true,
      status: 200,
      url: 'https://localhost',
      json: expect.any(Function)
    }))
    expect(callbackError).not.toHaveBeenCalled()
  })

  it('should get error', async () => {
    expect.hasAssertions()

    window.fetch = mockFail('nok')

    await setupFetch([''])

    expect(window.fetch).toHaveBeenCalledWith('', { method: 'PUT' })
    expect(callbackSuccess).not.toHaveBeenCalled()
    expect(callbackError).toHaveBeenNthCalledWith(1, expect.any(TypeError))
  })

  it('should build path', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    await setupFetch(
      ['/path'])

    expect(window.fetch).toHaveBeenCalledWith('/path', { method: 'PUT' })
    expect(callbackSuccess).toHaveBeenNthCalledWith(1, expect.objectContaining({
      ok: true,
      status: 200,
      url: '/path',
      json: expect.any(Function)
    }))
    expect(callbackError).not.toHaveBeenCalled()
  })

  it('should override method', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    await setupFetch(
      ['/path', { method: 'POST' }, { param: 'val' }])

    expect(window.fetch).toHaveBeenCalledWith('/path?param=val', { method: 'POST' })
    expect(callbackSuccess).toHaveBeenNthCalledWith(1, expect.objectContaining({
      ok: true,
      status: 200,
      url: '/path?param=val',
      json: expect.any(Function)
    }))
    expect(callbackError).not.toHaveBeenCalled()
  })

  it('should take params', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    await setupFetch(
      ['/path', undefined, { param: 'val' }])

    expect(window.fetch).toHaveBeenCalledWith('/path?param=val', { method: 'PUT' })
    expect(callbackSuccess).toHaveBeenNthCalledWith(1, expect.objectContaining({
      ok: true,
      status: 200,
      url: '/path?param=val',
      json: expect.any(Function)
    }))
    expect(callbackError).not.toHaveBeenCalled()
  })
})
