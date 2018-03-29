// @flow
import { createBrowserHistory } from 'history'
import { routerMiddleware, routerReducer } from 'react-router-redux'
import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import provider, { REDUCER_ID } from '~/wallets/store/reducer/provider'

export const history = createBrowserHistory()
// eslint-disable-next-line
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const finalCreateStore = composeEnhancers(applyMiddleware(
  thunk,
  routerMiddleware(history),
))

const reducers = combineReducers({
  routing: routerReducer,
  [REDUCER_ID]: provider,
})

export const store = createStore(reducers, finalCreateStore)
