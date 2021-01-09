/* eslint-disable react/display-name */
import { renderHook } from '@testing-library/react-hooks'

import { useFetch, useGet, usePost, usePut, useDelete } from '../src'
import { mockSuccess } from './fetch.mock'

const callbackSuccess = jest.fn().mockImplementation(() => {})
const callbackError = jest.fn().mockImplementation(() => {})

const setupFetch = async (useIt, fetchParams = [], renderOptions) => {
  const { result, waitForNextUpdate } = renderHook(() => useIt(...fetchParams), renderOptions)

  return waitForNextUpdate().then(() => {
    if (result.current.error) {
      callbackError(result.current.error)
    }
    if (result.current.result) {
      callbackSuccess(result.current.result)
    }
  })
}

describe('with useFetch', () => {
  it('should get', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    await setupFetch(useFetch, ['', { method: 'GET' }])

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

    await setupFetch(useGet, [''])

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

    await setupFetch(useGet, ['', { method: 'POST' }])

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

    await setupFetch(usePost, [''])

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

    await setupFetch(usePut, [''])

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

    await setupFetch(useDelete, [''])

    expect(window.fetch).toHaveBeenNthCalledWith(1, '', { method: 'DELETE' })
    expect(callbackSuccess).toHaveBeenNthCalledWith(1, expect.objectContaining({
      ok: true,
      status: 200,
      url: '',
      json: expect.any(Function)
    }))
    expect(callbackError).not.toHaveBeenCalled()
  })

  it.todo('should useRaw')
  it.todo('should test additional conditions param')
  it.todo('should useApi')
})
