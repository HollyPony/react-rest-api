import React, { createContext } from 'react'
import { buildApi } from './helper'

export const ApiContext = createContext(buildApi())
export const ApiProvider = ({ children, ...p }) => <ApiContext.Provider value={buildApi(p)}>{children}</ApiContext.Provider>
export const ApiConsumer = ApiContext.Consumer
export const withApi = C => p => <ApiConsumer>{api => <C {...p} api={api} />}</ApiConsumer>
