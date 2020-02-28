# React-Rest-Api

![Tests](https://github.com/HollyPony/react-rest-api/workflows/Execute%20Tests/badge.svg)
[![install size](https://packagephobia.now.sh/badge?p=react-rest-api)](https://packagephobia.now.sh/result?p=react-rest-api)

Lightweight – no dependencies – React API for rest calls supporting Provider config and use hooks.

It's basically [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) wrapped in a [React Context](https://reactjs.org/docs/context.htm) providing [React hooks](https://reactjs.org/docs/hooks-overview.html) and [React Consumer](https://reactjs.org/docs/context.html#contextconsumer).

> So, this doc will not explain how all this concepts works but how this package wrap it.

Features:

- Configurable: Configure fetch calls, for custom headers or prefix url for example
- Flexible: Keep full fetch options to be overridable
- React compliant: Wrap fetch on React context - even the native fetch
- Help: Automatic resolve query params
- Safe: Don't mutate the `window.fetch`
- Light: 3 432 bytes of source code - no third part dependencies ( + 10.5kb of README and pacakge related stuffs )

See a working demo on codesandbox : [https://codesandbox.io/s/github/HollyPony/react-rest-api-samples](https://codesandbox.io/s/github/HollyPony/react-rest-api-samples)

> This package is currently served as-is. With usage of all ES6 features without any bundling and/or specific whatever the system is used.

## TL;DR – basic full usage sample

`npm i react-rest-api`

```js
import React, { useState, } from 'react'
import { ApiProvider, useGet } from 'react-rest-api'

const SWPerson = ({ id }) => {
  const { loading, result, error, } = useGet(`people/${id}`)

  if (loading) {
    return 'loading ...'
  }

  if (error) {
    return error.toString() // Render String from Error type
  }

  return JSON.stringify(result, null, 2)
}

const resolveCallback = response => response.json()

const App = () => {
  const [url, setUrl] = useState('https://swapi.co/api/')
  const [config, setConfig] = useState({
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return (
    <ApiProvider
      url={url} // Optional: prefix url api calls
      config={config} // Optional: Init default config of fetch
      setUrl={setUrl} // Optional: Provide context accessible function to update state
      setConfig={setConfig} // Optional: Provide context accessible function to update state
      resolveCallback={resolveCallback} // Optional: Provide callback function for success fetchs
    >
      <SWPerson id={3} />
    </ApiProvider>
  )
}

const AppAlternative = () => {
  const [apiConfig, setApiConfig] = useState({
    url: 'https://swapi.co/api/',
    config: {
      headers: {
        'Content-Type': 'application/json'
      }
    },
    resolveCallback
  })

  return (
    <ApiProvider {...apiConfig} setConfig={setApiConfig}>
      <SWPerson id={3} />
    </ApiProvider>
  )
}

ReactDOM.render(<App />, document.getElementById("root"));
```

## Install

- `npm i react-rest-api`

## Usage

### Configure API

> NOT REQUIRED. You can add the Provider if it's useful for you

You can use `ApiProvider` to with `url` and `config` to configure fetch:

```js
import { ApiProvider, useGet } from 'react-rest-api'

const url = 'https://swapi.co/api/'
const config = {
  Authorization: 'aksjhdksjhfalksdjghlaksdjhflksdjahfa'
  headers: {
    'Content-Type': 'application/json',
    'X-ApiKey': '1234567890'
  }
}

const Page = () => {
  const {loading, result, error} = useGet('people/3', )

  if (loading) {
    return 'loading ...'
  }

  return JSON.stringify(error || result, null, 2)
}

const App = () => (
  <ApiProvider
    url={url}
    config={config}>
    <Page />
  </ApiProvider>
)
```

#### url (Optional)

```javascript
  <ApiProvider
    url={String} />
```

Will prefix all api call with provided `url`.

> Note: There is extra managment of `/`. Be careful dealing with it

#### config (Optional)

```javascript
  <ApiProvider
    config={Object} />
```

`config` should be an object corresponding will send as fetch [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) param by default for all api calls.

Merge method allow to overrided this default by the `config` param of all api methods.

#### resolveCallback | rejectCallback (Optional)

```javascript
  <ApiProvider
    resolveCallback={Function : Promise}
    rejectCallback={Function : Promise} />
```

This should be methods which will be binded to the `then`/`catch` result of `fetch` and apply to all api calls.

Example:

```javascript
const resolveCallback = response => response.ok ? response.json() : Promise.reject(response)
```

This will reject the call into `rejectCallback` and `error` result of api calls.

> Note: fetch API consider a 400 response as success call with `ok: false`.

#### setUrl | setConfig

```javascript
  <ApiProvider
    setUrl={Function : any}
    setConfig={Function : any} />
```

Basically these are shortcuts providing [context level functions](https://reactjs.org/docs/context.html#updating-context-from-a-nested-component) through nested components.

It's allow calls from api which be directly call provided function.

#### dispatch (Optional)

WIP

```javascript
  <ApiProvider
    dispatch={dispatch} />
```

A function will be called during fetch process. To be used with reducers `dispatch` functions.

### Call the api

Since it's a configured React context, you have a two native ways to access the apis + convienient hooks provided by this package.

#### Access api with useContext

```js
import React, { useContext } from 'react'
import { ApiContext } from 'react-rest-api'

const SWPerson = () => {
  const api = useContext(ApiContext)
  
  api.get('https://swapi.co/api/people/3')
}
```

> This is a demo sample, if you use `useContext` you probably should wrap your call in a `useEffect` or `useCallback` depending the need then apply the result in then/catch or await / try catch.

#### Access api with ApiConsumer

Usage without hooks.

```js
import React from './react'
import { withApi } from 'react-rest-api'

const _SWPerson = () => {
  componentDidMount() {
    const { api } = this.props

    api.getJson('https://swapi.co/api/people/3')
  }
}

export const SWPerson = withApi(_SWPerson)

// Or alternative

import React from './react'
import { ApiConsumer } from 'react-rest-api'

const _SWPerson = () => {
  componentDidMount() {
    const { api } = this.props

    api.getJson('https://swapi.co/api/people/3')
  }
}

export const SWPerson = (...props) => <ApiConsumer>{ api => <_SWPerson {...props} api={api} /> }</ApiConsumer>
```

#### Access api through custom hooks > use[Method]

```js
import React from './react'
import { useGet } from 'react-rest-api'

const SWPerson = () => {
  const { loading, result, error } = useGet('https://swapi.co/api/people/3')
}
```

### Available api methods

#### api fetch

```javascript
api.fetch(url: string, config: Object, queryParams: Object) : Promise
```

This function is the most important part the main motivation of this project.

- `url`: the called url. If one is define in ApiProvider, it will be concatenate. There is currently no transformation arounds the slashes `/` treatment so don't miss yours ;)
- `config`: gracefully merge the object with config of ApiProvider.

    > config can take an extra parameter `_stringifyBody` which result to `JSON.stringify(config.body)`
- `queryParams`: is an Object for query params, under the hood use `URLSearchParams` to build a string then concat to `url` with a `?`.

    > `api.get('localhost', undeifned, {param1: 'value1'})` result to a call on `localhost?value1=value1`

#### api get | post | put | del

```javascript
api.get(url: string, config: Object, queryParams: Object) : Promise
api.post(url: string, config: Object, queryParams: Object) : Promise
api.put(url: string, config: Object, queryParams: Object) : Promise
api.del(url: string, config: Object, queryParams: Object) : Promise
```

Respectively corresponding to `GET`, `POST`, `PUT`, `DELETE` methods.

This method are wrapper of `api.fetch` with pre-defined `config: {method: 'METHOD'}`.

> Note: You can call `api.get('localhost', method: 'POST'})`. This will result to an effective POST call, overriding the method.

#### raw

`api.raw(url: string, config: Object) : Promise`

Simple wrapper of original `window.fetch` method in the Context. You probably don't need it. It's use internally and it's simply exported

#### api useFetch | useGet | usePost | usePut | useDelete | useRaw

```javascript
useFetch(url: string, config: Object, queryParams: Object, conditions: Array) : Promise
useGet(url: string, config: Object, queryParams: Object, conditions: Array) : Promise
usePost(url: string, config: Object, queryParams: Object, conditions: Array) : Promise
usePut(url: string, config: Object, queryParams: Object, conditions: Array) : Promise
useDelete(url: string, config: Object, queryParams: Object, conditions: Array) : Promise
useRaw(url: string, config: Object, conditions: Array) : Promise
```

Same signature as original methods plus an Array of conditions.

`conditions` is an Array passed as-is to the [`useEffect`](https://reactjs.org/docs/hooks-effect.html) method as dependencies.

#### api setUrl | setConfig

```javascript
setUrl(any) : any
setConfig(any) : any
```

> In order to call this function you should define them in Provider

Once defined, allow you to call these callbacks in the whole context. See the [codesandbox](https://codesandbox.io/s/github/HollyPony/react-rest-api-samples) for more informations.
