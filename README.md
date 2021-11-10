# React-Rest-Api

![Release](https://badgen.net/github/release/hollypony/react-rest-api)
![Minified](https://badgen.net/bundlephobia/min/react-rest-api)
![Minified + zip](https://badgen.net/bundlephobia/minzip/react-rest-api)
![Dependencies](https://badgen.net/github/dependents-pkg/hollypony/react-rest-api)
![Tests](https://github.com/HollyPony/react-rest-api/workflows/Execute%20Tests/badge.svg)
![Tech Debt](https://badgen.net/codeclimate/tech-debt/HollyPony/react-rest-api)
![Maintainability](https://badgen.net/codeclimate/maintainability/HollyPony/react-rest-api)

Lightweight – no dependencies – React API for rest calls supporting Provider config and use hooks.

It's basically [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) wrapped in a [React Context](https://reactjs.org/docs/context.htm) providing [React hooks](https://reactjs.org/docs/hooks-overview.html) and [React Consumer](https://reactjs.org/docs/context.html#contextconsumer).

> So, this doc will not explain how all this concepts works but how this package wrap it.

Features:

- Configurable: Configure fetch calls, for custom headers or prefix url for example
- Flexible: Keep full fetch options to be overridable
- React compliant: Wrap fetch on React context
- Helper: Automatic resolve query params
- Safe: Don't mutate the `window.fetch`

See a working demo on codesandbox : [https://codesandbox.io/s/github/HollyPony/react-rest-api-samples](https://codesandbox.io/s/github/HollyPony/react-rest-api-samples)

> This package is currently served as-is. With usage of all ES6 features without any bundling and/or specific whatever the system is used.

## Next features:

- Proxiing config in order to define a config per method (or whatever the condition)
- Make unit tests great again

## TL;DR – basic full usage sample

`npm i react-rest-api`

```js
import React, { useState, useEffect, useReducer } from "react";
import ReactDOM from "react-dom";
import { ApiProvider, useApi } from "react-rest-api";

const defaultConfig = {
  headers: {
    // All api calls will take this Content-Type Header
    "Content-Type": "application/json",
    X_MY_APP_API_KEY: "XXX"
  }
};

const App = () => {
  // `url` and `config` refer respectively to `resource` and `init` from https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
  const url = "https://jsonplaceholder.typicode.com";
  const [config, setConfig] = useState(defaultConfig);

  function signin(token) {
    // Update the api config merging the current one
    setConfig({
      ...defaultConfig,
      headers: {
        ...defaultConfig.headers,
        Authorization: token
      }
    });
  }

  // Consider a logout function
  // function signout() {
  //   setConfig(defaultConfig);
  // }

  // All resolved response shoudl be converted to json according to the content type
  function resolveHook(response) {
    // Check the ok prop to consider the response as rejected as needed like:
    return response.ok
      ? // `.json()` if ok
        response.json()
      : // if not `ok` fallback to rejectHook
        Promise.reject(response);
  }

  // Treat fails here before returning to your call
  // Note: The rejected reponse above will fall here
  function rejectHook(response) {
    return Promise.reject(response);
  }

  return (
    <ApiProvider
      url={url} // Optional: prefix url api calls. Litteraly, it's a prefix for api calls.
      config={config} // Optional: Init default config of fetch. It can be overridable per calls later (or wrapping another ApiProvider)
      resolveHook={resolveHook} // Optional: Provide callback function for success fetchs
      rejectHook={rejectHook} // Optionnal: Provider reject callback
    >
      <SignIn signinCallback={signin} />
    </ApiProvider>
  );
};

const SignIn = ({ signinCallback }) => {
  const api = useApi();

  const [dataState, dataDispatch] = useReducer(reducer, {
    status: "initialized",
    payload: {}
  });

  function getSuccess() {
    dataDispatch({ status: "initializing" });
    // Call 'https://myendpoint.co/api/' + '/slug/details' + '?id=42&filter=random'
    api
      .get("/comments", undefined, { id: 42, filter: "random" })
      .then((payload) => {
        // Note that: payload is already jsonified due to resolveCallback
        dataDispatch({ status: "initialized", payload });
      })
      .catch((payload) => {
        // FeelsBadMan
        dataDispatch({ status: "error", payload });
      });
  }

  function postSuccess() {
    dataDispatch({ status: "initializing" });
    api
      .post("/comments", {
        body: JSON.stringify({ prop: "usefull stringify operation" })
      })
      .then((payload) => {
        signinCallback("myToken");
        dataDispatch({ status: "initialized", payload });
      })
      .catch((payload) => {
        dataDispatch({ status: "error", payload });
      });
  }

  function postError() {
    dataDispatch({ status: "initializing" });
    api
      .post("/error", {
        body: JSON.stringify({ prop: "usefull stringify operation" }),
        headers: {
          // This will override the default Content-type. Note the Authorization will be preserved
          // :warning: This is for demo pruposes only, `body: JSON.stringify` should be treated as `application/json`. It's just to show a config override per call.
          "Content-Type": "text/html; charset=utf-8"
        }
      })
      .then((payload) => {
        signinCallback("myToken");
        dataDispatch({ status: "initialized", payload });
      })
      .catch((payload) => {
        dataDispatch({ status: "error", payload });
      });
  }

  return (
    <>
      <div>
        <button onClick={getSuccess}>GET SUCCESS</button>
        <button onClick={postSuccess}>POST SUCCESS</button>
        <button onClick={postError}>POST ERROR</button>
      </div>
      {dataState.status === "initializing" && "loading ..."}
      {dataState.status === "error" && (
        <div>
          Error:
          <pre>{JSON.stringify(dataState.payload, null, 2)}</pre>
        </div>
      )}
      {dataState.status === "initialized" && (
        <div>
          Success:
          <pre>{JSON.stringify(dataState.payload, null, 2)}</pre>
        </div>
      )}
    </>
  );
};

// Wrap the reducer whatever we dont care that's not the point here
function reducer(state, action) {
  return { ...state, ...action };
}

ReactDOM.render(<App />, document.getElementById("root"));
```

## Install

- `npm i react-rest-api`

## Usage

### ApiProvider

#### Syntax

```js
<ApiProvider
  url={String}
  config={Object}
  resolveHook={Function}
  rejectHook={Function}
/>
```

#### url (Optional)

A string that prefix calls. Default to empty string.

> Note: There is no extra managment for `/`. Keep in mind to add one at the end of url or add one before each api call,

#### config (Optional)

An object gracefully merged for all calls prior to the caller. default to empty Object.

`config` should be an object corresponding will send as fetch [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) param by default for all api calls.

Overridable by `config` param of all api methods.

#### resolveHook | rejectHook (Optional)

Consider this methods as global fetch wrapper as:

```js
fetch(...)
  .then(resolveHook)
  .catch(rejectHook)
```

because it's exactly how it's wrapped.

> Note: fetch API consider a 400 response as success call with `ok: false` on then so. See the sample above for a solution. That's my main motivation to write this package.

### `useApi` / `apiContext`

```js
import { useApi, apiContext } from 'react-rest-api'
```

> Note that `useApi` is a basic wrapper for `useContext(apiContext)`

Since it's a configured React context, you have a two native ways to access the apis + convienient hooks provided by this package.

This is the entry point to use the api.

### Access api with ApiConsumer

There is no Consumer provided. Feel free to create your local own with the apiContext `<apiContext.Consumer />` lessgo.

### Context provided

Props Available through the `useApi` / `useContext(apiContext)`: `const api = useApi()`

#### api fetch

```javascript
api.fetch(url: string, config: Object, queryParams: Object) : Promise
```

This function is the most important part the main motivation of this project.

- `url`: the called url. If one is define in ApiProvider, it will be concatenate. There is currently no transformation arounds the slashes `/` treatment so don't miss yours ;)
- `config`: merge the object with config of ApiProvider.
- `queryParams`: is an Object for query params, under the hood use `URLSearchParams` to build a string then concat to `url` with a `?`.

    > `api.get('localhost', undefined, {param1: 'value1'})` result to a call on `localhost?param1=value1`
    
    > queryParams take care of list. `{ type: [1, 2, 3] }` result to `?type=1&type=2&type=3`
    
    > Dates object will be parsed with `toISOString` method. If you wont this behaviour, parse the date before the call, ie. don't pass Date Object.

#### api get | post | put | del

```javascript
api.get(url: string, config: Object, queryParams: Object) : Promise
api.post(url: string, config: Object, queryParams: Object) : Promise
api.put(url: string, config: Object, queryParams: Object) : Promise
api.del(url: string, config: Object, queryParams: Object) : Promise
```

This methods are wrapper for `api.fetch` with pre-defined `config: {method: 'METHOD'}` respectively `GET`, `POST`, `PUT` and `DELETE`

> Note: You can call `api.get('localhost', method: 'POST'})`. This will result to an effective POST call, overriding the method. config on call is always the best.
