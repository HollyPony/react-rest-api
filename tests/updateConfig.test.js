/* eslint-disable react/display-name */
import React, { useState, useContext, useEffect } from 'react'
import { render, wait } from '@testing-library/react'

import { ApiProvider, ApiContext } from '../src'
import { mockSuccess } from './fetch.mock'

const ProvideFunctions = ({ defaultUrl = '', defaultConfig = {}, ...props }) => {
  const [url, setUrl] = useState(defaultUrl)
  const [config, setConfig] = useState(defaultConfig)

  return <ApiProvider url={url} config={config} setUrl={setUrl} setConfig={setConfig} {...props} />
}

describe('updateConfig', () => {
  it('should update url', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    const Content = () => {
      const api = useContext(ApiContext)

      useEffect(() => {
        api.setUrl(oldUrl => `${oldUrl}/path`)
      }, [])

      useEffect(() => {
        api.fetch('')
      }, [api])

      return ''
    }

    render(<Content />, { wrapper: (props) => <ProvideFunctions defaultUrl='https://localhost' {...props} /> })

    await wait()

    expect(window.fetch).toHaveBeenNthCalledWith(1, 'https://localhost', {})
    expect(window.fetch).toHaveBeenNthCalledWith(2, 'https://localhost/path', {})
  })

  it('should set config', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    const Content = () => {
      const api = useContext(ApiContext)

      useEffect(() => {
        api.setConfig(oldConfig => ({ ...oldConfig, method: 'POST' }))
      }, [])

      useEffect(() => {
        api.fetch('')
      }, [api])

      return ''
    }

    render(<Content />, { wrapper: (props) => <ProvideFunctions defaultUrl='https://localhost' {...props} /> })

    await wait()

    expect(window.fetch).toHaveBeenNthCalledWith(1, 'https://localhost', {})
    expect(window.fetch).toHaveBeenNthCalledWith(2, 'https://localhost', { method: 'POST' })
  })

  it('should override config', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    const Content = () => {
      const api = useContext(ApiContext)

      useEffect(() => {
        api.setConfig(oldConfig => ({ ...oldConfig, method: 'POST' }))
      }, [])

      useEffect(() => {
        api.fetch('')
      }, [api])

      return ''
    }

    render(<Content />, {
      wrapper: (props) =>
        <ProvideFunctions
          defaultUrl='https://localhost'
          defaultConfig={{
            method: 'GET'
          }}
          {...props}
        />
    })

    await wait()

    expect(window.fetch).toHaveBeenNthCalledWith(1, 'https://localhost', { method: 'GET' })
    expect(window.fetch).toHaveBeenNthCalledWith(2, 'https://localhost', { method: 'POST' })
  })

  it('should set config header', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    const Content = () => {
      const api = useContext(ApiContext)

      useEffect(() => {
        api.setConfig(oldConfig => ({ ...oldConfig, headers: { 'X-Custom': 'value' } }))
      }, [])

      useEffect(() => {
        api.fetch('')
      }, [api])

      return ''
    }

    render(<Content />, {
      wrapper: (props) =>
        <ProvideFunctions
          defaultUrl='https://localhost'
          {...props}
        />
    })

    await wait()

    expect(window.fetch).toHaveBeenNthCalledWith(1, 'https://localhost', {})
    expect(window.fetch).toHaveBeenNthCalledWith(2, 'https://localhost', { headers: { 'X-Custom': 'value' } })
  })

  it('should add config header', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    const Content = () => {
      const api = useContext(ApiContext)

      useEffect(() => {
        api.setConfig(oldConfig => ({ ...oldConfig, headers: { ...oldConfig.headers, 'X-Custom-2': 'value' } }))
      }, [])

      useEffect(() => {
        api.fetch('')
      }, [api])

      return ''
    }

    render(<Content />, {
      wrapper: (props) =>
        <ProvideFunctions
          defaultUrl='https://localhost'
          defaultConfig={{
            headers: { 'X-Custom-1': 'value' }
          }}
          {...props}
        />
    })

    await wait()

    expect(window.fetch).toHaveBeenNthCalledWith(1, 'https://localhost', { headers: { 'X-Custom-1': 'value' } })
    expect(window.fetch).toHaveBeenNthCalledWith(2, 'https://localhost', { headers: { 'X-Custom-1': 'value', 'X-Custom-2': 'value' } })
  })

  it('should ovrride config header', async () => {
    expect.hasAssertions()

    window.fetch = mockSuccess()

    const Content = () => {
      const api = useContext(ApiContext)

      useEffect(() => {
        api.setConfig(oldConfig => ({ ...oldConfig, headers: { 'X-Custom': 'valueOverride' } }))
      }, [])

      useEffect(() => {
        api.fetch('')
      }, [api])

      return ''
    }

    render(<Content />, {
      wrapper: (props) =>
        <ProvideFunctions
          defaultUrl='https://localhost'
          defaultConfig={{
            headers: { 'X-Custom': 'valueBase' }
          }}
          {...props}
        />
    })

    await wait()

    expect(window.fetch).toHaveBeenNthCalledWith(1, 'https://localhost', { headers: { 'X-Custom': 'valueBase' } })
    expect(window.fetch).toHaveBeenNthCalledWith(2, 'https://localhost', { headers: { 'X-Custom': 'valueOverride' } })
  })

  it('should throw calling setUrl without provider', async () => {
    expect.hasAssertions()
    const spy = jest.spyOn(console, 'error')
    spy.mockImplementation(() => {})

    window.fetch = mockSuccess()

    const Content = () => {
      const api = useContext(ApiContext)
      api.setUrl()

      return ''
    }

    expect(() =>
      render(<Content />)
    ).toThrow('You should provide `setUrl` to <ApiProvider />')
    spy.mockRestore()
  })

  it('should throw calling setConfig without provider', async () => {
    expect.hasAssertions()
    const spy = jest.spyOn(console, 'error')
    spy.mockImplementation(() => {})

    window.fetch = mockSuccess()

    const Content = () => {
      const api = useContext(ApiContext)
      api.setConfig()

      return ''
    }

    expect(() =>
      render(<Content />)
    ).toThrow('You should provide `setConfig` to <ApiProvider />')
    spy.mockRestore()
  })

  it('should throw calling setUrl with defined it', async () => {
    expect.hasAssertions()
    const spy = jest.spyOn(console, 'error')
    spy.mockImplementation(() => {})

    window.fetch = mockSuccess()

    const Content = () => {
      const api = useContext(ApiContext)
      api.setUrl()

      return ''
    }

    expect(() =>
      render(<Content />, { wrapper: (props) => <ApiProvider {...props} /> })
    ).toThrow('You should provide `setUrl` to <ApiProvider />')
    spy.mockRestore()
  })

  it('should throw calling setConfig with defined it', async () => {
    expect.hasAssertions()
    const spy = jest.spyOn(console, 'error')
    spy.mockImplementation(() => {})

    window.fetch = mockSuccess()

    const Content = () => {
      const api = useContext(ApiContext)
      api.setConfig()

      return ''
    }

    expect(() =>
      render(<Content />, { wrapper: (props) => <ApiProvider {...props} /> })
    ).toThrow('You should provide `setConfig` to <ApiProvider />')
    spy.mockRestore()
  })
})
