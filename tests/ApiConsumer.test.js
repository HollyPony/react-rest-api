/* eslint-disable react/display-name */
import React from 'react'
import { render, wait } from '@testing-library/react'

import { ApiConsumer } from '../src'
import { mockSuccess } from './fetch.mock'

const callbackSuccess = jest.fn().mockImplementation(() => {})
const callbackError = jest.fn().mockImplementation(() => {})

const setupFetch = async (fct, fetchParams = [], renderOptions) => {
  callbackSuccess.mockReset()
  callbackError.mockReset()

  render(
    <ApiConsumer>{api => {
      api[fct](...fetchParams)
        .then(callbackSuccess)
        .catch(callbackError)
      return ''
    }}
    </ApiConsumer>, renderOptions)
  await wait()
}

describe('with ApiConsumer', () => {
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

  it.todo('should test api.raw')
  it.todo('should use withApi wrapper')
  it.todo('should test additional conditions param')
})
