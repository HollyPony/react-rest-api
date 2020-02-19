# React-Rest-Api

![Execute Tests](https://github.com/HollyPony/react-rest-api/workflows/Execute%20Tests/badge.svg)

Lightweight – no dependencies – React API for rest calls supporting Provider config and use hooks.

It's basically [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) wrapped in a [React Context](https://reactjs.org/docs/context.htm) providing [React hooks](https://reactjs.org/docs/hooks-overview.html) and [React Consumer](https://reactjs.org/docs/context.html#contextconsumer).

> So, this doc will not explain how all this concepts works but how this package wrap it.

Features:

- Configure fetch calls, for custom headers or prefix url for example
- Keep full fetch options to be overridable
- Wrap fetch on React context
- Automatic resolve query params
- Don't mutate the `window.fetch`
- 12kb full unpacked package including README (6kb only for this file) - no third part dependencies

See a working demo on codesandbox : [https://codesandbox.io/s/github/HollyPony/react-rest-api-samples](https://codesandbox.io/s/github/HollyPony/react-rest-api-samples)

> This package is currently served as-is. With usage of all ES6 features without any bundling and/or specific whatever the system is used.

## TL;DR – basic full usage sample

`npm i react-rest-api`

```js
import React from 'react'
import { ApiProvider, useGet } from 'react-rest-api'

const SWPerson = ({ id }) => {
  const { loading, result, error } = useGet(`people/${id}`)

  if (loading) {
    return 'loading ...'
  }

  if (error) {
    return error.toString() // Render String from Error type
  }

  return JSON.stringify(result, null, 2)
}

const url = 'https://swapi.co/api/'
const config = {
  headers: {
    'Content-Type': 'application/json'
  }
}

const resolveCallback = response => response.json()

ReactDOM.render(<ApiProvider
  url={url}
  config={config}
  resolveCallback={resolveCallback}>
  <SWPerson id={3} />
</ApiProvider>, document.getElementById("root"));
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
    url={url} />
```

Will prefix all api call with provided `url`.

> Note: There is extra managment of `/`. Be careful dealing with it

#### config (Optional)

```javascript
  <ApiProvider
    config={config} />
```

`config` should be an object corresponding will send as fetch [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) param by default for all api calls.

Merge method allow to overrided this default by the `config` param of all api methods.

#### resolveCallback/rejectCallback (Optional)

```javascript
  <ApiProvider
    resolveCallback={resolveCallback}
    rejectCallback={rejectCallback} />
```

This should be methods which will be binded to the `then`/`catch` result of `fetch` and apply to all api calls.

Example:

```javascript
const resolveCallback = response => response.ok ? response.json() : Promise.reject(response)
```

This will reject the call into `rejectCallback` and `error` result of api calls.

> Note: fetch API consider a 400 response as success call with `ok: false`.

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

IMO the simpliest form of the api usage

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

#### Access api with useApi

> This `hook` require to provide the method name as string on first parameter. The rest of parameters still the same

```js
import React from './react'
import { useApi } from 'react-rest-api'

const SWPerson = () => {
  const { loading, result, error } = useFetch('https://swapi.co/api/people/3')
}
```

This hook invoke a [`useEffect`](https://reactjs.org/docs/hooks-effect.html), an additional `conditions` param could be provide as dependency for this effect.

`useApi('getJson', 'https://swapi.co/api/people/3', undefined, undefined, [recallIfChange])`

#### Shortcuts for methods through use[Method]

> The `use[Method](params)` hooks are wrapper of `useApi(method, ...params)`. Refer to `useApi` doc.

```js
import React from './react'
import { useGet } from 'react-rest-api'

const SWPerson = () => {
  const { loading, result, error } = useGet('https://swapi.co/api/people/3')
}
```

### Available api methods

#### fetch

```javascript
api.fetch(url: string, config: Object, queryParams: Object) : Promise
```

This function is the most important part the main motivation of this project.

- `url`: the called url. If one is define in ApiProvider, it will be concatenate. There is currently no transformation arounds the slashes `/` treatment so don't miss yours ;)
- `config`: gracefully merge the object with config of ApiProvider.

    > config can take an extra parameter `_stringifyBody` which result to `JSON.stringify(config.body)`
- `queryParams`: is an Object for query params, under the hood use `URLSearchParams` to build a string then concat to `url` with a `?`.

    > `api.get('localhost', undeifned, {param1: 'value1'})` result to a call on `localhost?value1=value1`

#### get | post | put | del

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

#### useFetch | useGet | usePost | usePut | useDelete | useRaw

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
