/* eslint-disable react/display-name */
import { useContext } from 'react'
import { renderHook } from '@testing-library/react-hooks'

import { ApiContext } from '../src'
import { mockSuccess } from './fetch.mock'

const callbackSuccess = jest.fn().mockImplementation(() => {})
const callbackError = jest.fn().mockImplementation(() => {})

const setupFetch = async (fct, fetchParams = [], renderOptions) => {
  const { result: { current: api } } = renderHook(() => useContext(ApiContext), renderOptions)

  callbackSuccess.mockReset()
  callbackError.mockReset()

  await api[fct](...fetchParams)
    .then(callbackSuccess)
    .catch(callbackError)
}

describe('with useApi', () => {
  it('should get', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    await setupFetch('fetch', ['', { method: 'GET' }])

    expect(window.fetch).toHaveBeenNthCalledWith(1, '', { method: 'GET' })
    expect(callbackSuccess).toHaveBeenNthCalledWith(1, expect.objectContaining({
      ok: true,
      status: 200,
      url: '',
      json: expect.any(Function)
    }))
    expect(callbackError).not.toHaveBeenCalled()
  })

  it('should useGet call get', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    await setupFetch('get', [''])

    expect(window.fetch).toHaveBeenNthCalledWith(1, '', { method: 'GET' })
    expect(callbackSuccess).toHaveBeenNthCalledWith(1, expect.objectContaining({
      ok: true,
      status: 200,
      url: '',
      json: expect.any(Function)
    }))
    expect(callbackError).not.toHaveBeenCalled()
  })

  it('should useGet override to POST', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    await setupFetch('get', ['', { method: 'POST' }])

    expect(window.fetch).toHaveBeenNthCalledWith(1, '', { method: 'POST' })
    expect(callbackSuccess).toHaveBeenNthCalledWith(1, expect.objectContaining({
      ok: true,
      status: 200,
      url: '',
      json: expect.any(Function)
    }))
    expect(callbackError).not.toHaveBeenCalled()
  })

  it('should usePost', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    await setupFetch('post', [''])

    expect(window.fetch).toHaveBeenNthCalledWith(1, '', { method: 'POST' })
    expect(callbackSuccess).toHaveBeenNthCalledWith(1, expect.objectContaining({
      ok: true,
      status: 200,
      url: '',
      json: expect.any(Function)
    }))
    expect(callbackError).not.toHaveBeenCalled()
  })

  it('should usePut', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    await setupFetch('put', [''])

    expect(window.fetch).toHaveBeenNthCalledWith(1, '', { method: 'PUT' })
    expect(callbackSuccess).toHaveBeenNthCalledWith(1, expect.objectContaining({
      ok: true,
      status: 200,
      url: '',
      json: expect.any(Function)
    }))
    expect(callbackError).not.toHaveBeenCalled()
  })

  it('should useDelete', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    await setupFetch('del', [''])

    expect(window.fetch).toHaveBeenNthCalledWith(1, '', { method: 'DELETE' })
    expect(callbackSuccess).toHaveBeenNthCalledWith(1, expect.objectContaining({
      ok: true,
      status: 200,
      url: '',
      json: expect.any(Function)
    }))
    expect(callbackError).not.toHaveBeenCalled()
  })

  it.todo('should api.raw')
  it.todo('should test additional conditions param')
})
