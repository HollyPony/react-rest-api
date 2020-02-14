/* eslint-disable react/display-name */

import React, { useContext } from 'react'
import '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'

import { ApiContext, ApiProvider } from '../src'
import { mockSuccess, mockFail } from './fetch.mock'

const callbackSuccess = jest.fn().mockImplementation(() => {})
const callbackError = jest.fn().mockImplementation(() => {})

const setupComponent = async (mockedFetch, providerProps) => {
  window.fetch = mockedFetch
  callbackSuccess.mockReset()
  callbackError.mockReset()

  const { result: { current: api } } = renderHook(() => useContext(ApiContext), {
    wrapper: props => <ApiProvider {...props} {...providerProps} />
  })

  await api.get('')
    .then(callbackSuccess)
    .catch(callbackError)

  expect(window.fetch).toHaveBeenCalledWith('', { method: 'GET' })
}

describe('apiProvider', () => {
  describe('resolveCallback', () => {
    it('should transform response to \'coucou\'', async () => {
      expect.hasAssertions()

      await setupComponent(mockSuccess(), {
        resolveCallback: () => 'coucou'
      })

      expect(callbackSuccess).toHaveBeenNthCalledWith(1, 'coucou')
      expect(callbackError).not.toHaveBeenCalled()
    })

    it('should call the json response', async () => {
      expect.hasAssertions()

      await setupComponent(mockSuccess('mock'), {
        resolveCallback: response => response.json()
      })

      expect(callbackSuccess).toHaveBeenNthCalledWith(1, 'mock')
      expect(callbackError).not.toHaveBeenCalled()
    })

    it('should throw Error', async () => {
      expect.hasAssertions()

      await setupComponent(mockSuccess(), {
        resolveCallback: () => { throw new Error('') }
      })

      expect(callbackSuccess).not.toHaveBeenCalled()
      expect(callbackError).toHaveBeenNthCalledWith(1, expect.any(Error))
    })

    it('should reject', async () => {
      expect.hasAssertions()

      await setupComponent(mockSuccess(), {
        resolveCallback: response => Promise.reject(response)
      })

      expect(callbackSuccess).not.toHaveBeenCalled()
      expect(callbackError).toHaveBeenNthCalledWith(1, expect.objectContaining({
        ok: true,
        status: 200,
        url: '',
        json: expect.any(Function)
      }))
    })
  })

  describe('rejectCallback', () => {
    it('should parse the TypeError into string', async () => {
      expect.hasAssertions()

      await setupComponent(mockFail(), {
        rejectCallback: response => Promise.reject(response.toString())
      })

      expect(callbackSuccess).not.toHaveBeenCalled()
      expect(callbackError).toHaveBeenNthCalledWith(1, 'TypeError')
    })

    it('should finally success', async () => {
      expect.hasAssertions()

      await setupComponent(mockFail(), {
        rejectCallback: response => Promise.resolve(response)
      })

      expect(callbackSuccess).toHaveBeenNthCalledWith(1, expect.any(TypeError))
      expect(callbackError).not.toHaveBeenCalled()
    })
  })
})
