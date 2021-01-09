import { useContext, useState, useEffect } from 'react'

import { ApiContext } from './Context'

const useFetcher = (fct, endpoint, config, params, conditions = []) => {
  const [state, setState] = useState({
    loading: true,
    result: undefined,
    error: undefined
  })
  const api = useContext(ApiContext)

  useEffect(() => {
    let ignore = false

    api[fct](endpoint, config, params)
      .then(result => !ignore ? setState({ loading: false, result }) : undefined)
      .catch(error => !ignore ? setState({ loading: false, error }) : undefined)
    return () => { ignore = true }
  }, conditions)

  return state
}

export const useRaw = (endpoint, config, conditions) => useFetcher('raw', endpoint, config, undefined, conditions)
export const useFetch = (...params) => useFetcher('fetch', ...params)
export const useGet = (...params) => useFetcher('get', ...params)
export const usePost = (...params) => useFetcher('post', ...params)
export const usePut = (...params) => useFetcher('put', ...params)
export const useDelete = (...params) => useFetcher('del', ...params)
export const useApi = () => useContext(ApiContext)
