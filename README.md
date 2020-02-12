# React-Rest-Api

![Execute Tests](https://github.com/HollyPony/react-rest-api/workflows/Execute%20Tests/badge.svg)

Lightweight React API for rest calls supporting Provider config and use hooks.

It's basically [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) wrapped in a [React Context](https://reactjs.org/docs/context.htm).

> So, this doc will not explain how `fetch` work but how this package wrap it.

Features:
- Configure fetch calls, for custom headers or prefix url for example
- Bind json request in order to make it easy
- Keep full fetch options to be overridable
- Wrap fetch on React context
- Automatic resolve query params
- Don't mutate the `window.fetch`

See a working demo on codesandbox : [https://codesandbox.io/s/github/HollyPony/react-rest-api-samples](https://codesandbox.io/s/github/HollyPony/react-rest-api-samples)

> This package is currently served as-is. With usage of all ES6 features without any bundling and/or specific whatever the system is used.

## Install

- `npm i react-rest-api`

## Configuration

> NOT REQUIRED. You can add the Provider if it's useful for you

You can use `ApiProvider` to with `url` and `config` to configure fetch:

```js
import { ApiProvider } from 'react-rest-api'

const url = 'https://swapi.co/api/'
const config = {
  Authorization: 'aksjhdksjhfalksdjghlaksdjhflksdjahfa'
  headers: {
    'X-ApiKey': '1234567890'
  }
}

const App = () => (
  <ApiProvider
    url={url}
    config={config}>
    <AppWhateverLayout />
  </ApiProvider>
)
```

Will configure api calls with this values by default.

A call for `api.getJson('people/3')` in Provider children result to a call to `https://swapi.co/api/people/3` with the `Authorization` and the custom headers.

## Usage

### Call the `api`

Since it's a configured React context, you have a two native ways to access the apis + convienient hooks provided by this package.

#### Access api with `useContext`

```js
import React, { useContext } from 'react'
import { ApiContext } from 'react-rest-api'

const SWPerson = () => {
  const api = useContext(ApiContext)
  
  api.getJson('https://swapi.co/api/people/3')
}
```

> This is a demo sample, if you use `useContext` you probably should wrap your call in a `useEffect` or `useCallback` depending the need

#### Access api with `ApiConsumer`

```js
import React from './react'
import { ApiConsumer } from 'react-rest-api'

const SWPerson = () => {
  componentDidMount() {
    const { api } = this.props
    
    api.getJson('https://swapi.co/api/people/3')
  }
}

const SWPersonWrapper = (...props) => <ApiConsumer>{ api => <SWPerson {...props} api={api} /> }</ApiConsumer>
```

#### Access api with `useApi`

> This `hook` require to provide the method name as string on first parameter. The rest of parameters still the same

```js
import React from './react'
import { useApi } from 'react-rest-api'

const SWPerson = () => {
  const { loading, result, error } = useApi('getJson', 'https://swapi.co/api/people/3')
}
```

This hook invoke a [`useEffect`](https://reactjs.org/docs/hooks-effect.html), an additional `conditions` param could be provide as dependency for this effect.

`useApi('getJson', 'https://swapi.co/api/people/3', undefined, undefined, [recallIfChange])`

#### Shortcuts for methods through `use[Method]`

> The `use[Method](params)` hooks are wrapper of `useApi(method, ...params)`. Refer to `useApi` doc.

```js
import React from './react'
import { useGet } from 'react-rest-api'

const SWPerson = () => {
  const { loading, result, error } = useGetJson('https://swapi.co/api/people/3')
}
```

### Available api methods

#### `fetch`

`api.fetch(url: string, queryParams: Object, config: Object) : Promise`

This function is the most important part the main motivation of this project.

- `url`: the called url. If one is define in ApiProvider, it will be concatenate. There is currently no transformation arounds the slashes `/` treatment so don't miss yours ;)
- `queryParams`: is an Object for query params, under the hood use `URLSearchParams` to build a string then concat to `url` with a `?`.

    > `api.get('localhost', {param1: 'value1'})` result to a call on `localhost?value1=value1`
- `config`: gracefully merge the object with config of ApiProvider. 

    > Note: This config will overwrite the one in Provider like `finalConfig = {...providerConfig, ...fetchConfig}`

#### `get` | `post` | `put` | `del`

`api.get(url: string, queryParams: Object, config: Object) : Promise`

`api.post(url: string, queryParams: Object, config: Object) : Promise`

`api.put(url: string, queryParams: Object, config: Object) : Promise`

`api.del(url: string, queryParams: Object, config: Object) : Promise`

Respectively corresponding to `GET`, `POST`, `PUT`, `DELETE` methods.

This method are wrapper of `api.fetch` with pre-defined `config: {method: 'METHOD'}`.

> Note: You can call `api.get('localhost', undefined, {method: 'POST'})`. This will result to an effective POST call. I don't know why you do that but I'm not judging.

#### `getJson` | `postJson` | `putJson` | `delJson`

`api.getJson(url: string, queryParams: Object, config: Object) : Promise`

`api.postJson(url: string, queryParams: Object, config: Object) : Promise`

`api.putJson(url: string, queryParams: Object, config: Object) : Promise`

`api.delJson(url: string, queryParams: Object, config: Object) : Promise`

Similar to `get|etc...` but wrappped adding a header `'Content-Type': 'application/json'` + return the result the calling the `response.json()` for you. Nothing more, nothing less.
 
#### `raw`

`api.raw(url: string, confif: Object) : Promise`

Simple wrapper of `fetch` method in the Context. You probably don't need it.



