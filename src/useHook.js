import { useContext, useState, useEffect } from 'react'

import { ApiContext } from './Context'

export const useApi = (method, endpoint, params, config, conditions = []) => {
  const [state, setState] = useState({
    loading: true,
    result: undefined,
    error: undefined
  })
  const api = useContext(ApiContext)

  useEffect(() => {
    let ignore = false

    api[method](endpoint, params, config)
      .then(result => {
        if (!ignore) {
          setState({ loading: false, result })
        }
      })
      .catch(error => {
        if (!ignore) {
          setState({ loading: false, error })
        }
      })
    return () => {
      ignore = true
    }
  }, conditions)

  return state
}

export const useGet = (...params) => useApi('get', ...params)
export const useGetJson = (...params) => useApi('getJson', ...params)
export const usePost = (...params) => useApi('post', ...params)
export const usePostJson = (...params) => useApi('postJson', ...params)
export const usePut = (...params) => useApi('put', ...params)
export const usePutJson = (...params) => useApi('putJson', ...params)
export const useDelete = (...params) => useApi('del', ...params)
export const useDeleteJon = (...params) => useApi('delJson', ...params)
