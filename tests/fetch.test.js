import { useContext } from 'react'
import { renderHook } from '@testing-library/react-hooks'

import { ApiContext } from '../src'
import { mockSuccess, mockFail } from './fetch.mock'

const callbackSuccess = jest.fn().mockImplementation(() => {})
const callbackError = jest.fn().mockImplementation(() => {})

const setupFetch = async (fetchParams = []) => {
  const { result: { current: api } } = renderHook(() => useContext(ApiContext))

  callbackSuccess.mockReset()
  callbackError.mockReset()

  await api.fetch(...fetchParams)
    .then(callbackSuccess)
    .catch(callbackError)
}

describe('fetch without provider', () => {
  it('should get success without url without config without params', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    await setupFetch([''])

    expect(window.fetch).toHaveBeenCalledWith('', {})
    expect(callbackSuccess).toHaveBeenNthCalledWith(1, expect.objectContaining({
      ok: true,
      status: 200,
      url: '',
      json: expect.any(Function)
    }))
    expect(callbackError).not.toHaveBeenCalled()
  })

  it('should get fail without url without config without params', async () => {
    expect.hasAssertions()

    window.fetch = mockFail('nok')

    await setupFetch([''])

    expect(window.fetch).toHaveBeenCalledWith('', {})
    expect(callbackSuccess).not.toHaveBeenCalled()
    expect(callbackError).toHaveBeenNthCalledWith(1, expect.any(TypeError))
  })

  it('should get success with url without config without params', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    await setupFetch(['https://localhost'])

    expect(window.fetch).toHaveBeenCalledWith('https://localhost', {})
    expect(callbackSuccess).toHaveBeenNthCalledWith(1, expect.objectContaining({
      ok: true,
      status: 200,
      url: 'https://localhost',
      json: expect.any(Function)
    }))
    expect(callbackError).not.toHaveBeenCalled()
  })

  it('should get success with url without config with params', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    await setupFetch(['https://localhost', undefined, { param: 'val' }])

    expect(window.fetch).toHaveBeenCalledWith('https://localhost?param=val', {})
    expect(callbackSuccess).toHaveBeenNthCalledWith(1, expect.objectContaining({
      ok: true,
      status: 200,
      url: 'https://localhost?param=val',
      json: expect.any(Function)
    }))
    expect(callbackError).not.toHaveBeenCalled()
  })

  it('should get success with url with config without params', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    await setupFetch(['https://localhost', { headers: { 'Content-Type': 'application/json' } }])

    expect(window.fetch).toHaveBeenCalledWith('https://localhost', { headers: { 'Content-Type': 'application/json' } })
    expect(callbackSuccess).toHaveBeenNthCalledWith(1, expect.objectContaining({
      ok: true,
      status: 200,
      url: 'https://localhost',
      json: expect.any(Function)
    }))
    expect(callbackError).not.toHaveBeenCalled()
  })

  it('should get stringify body', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    await setupFetch(['https://localhost', { _stringifyBody: true, body: { param: 'val' } }])

    expect(window.fetch).toHaveBeenCalledWith('https://localhost', { body: JSON.stringify({ param: 'val' }) })
    expect(callbackSuccess).toHaveBeenNthCalledWith(1, expect.objectContaining({
      ok: true,
      status: 200,
      url: 'https://localhost',
      json: expect.any(Function)
    }))
    expect(callbackError).not.toHaveBeenCalled()
  })
})
