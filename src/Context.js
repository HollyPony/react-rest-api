import React, { createContext } from 'react'
import { buildApi } from './helper'

export const ApiContext = createContext(buildApi())
export const ApiProvider = ({ children, ...p }) => React.createElement(ApiContext.Provider, { value: buildApi(p) }, children)
export const ApiConsumer = ApiContext.Consumer
export const withApi = C => p => React.createElement(ApiConsumer, null, api => React.createElement(C, { ...p, api }))
