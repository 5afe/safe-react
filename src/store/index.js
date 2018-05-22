// @flow
import { createBrowserHistory } from 'history'
import { routerMiddleware, routerReducer } from 'react-router-redux'
import { combineReducers, createStore, applyMiddleware, compose, type Reducer, type Store } from 'redux'
import thunk from 'redux-thunk'
import provider, { PROVIDER_REDUCER_ID, type State as ProviderState } from '~/wallets/store/reducer/provider'
import safe, { SAFE_REDUCER_ID, safeInitialState, type State as SafeState } from '~/routes/safe/store/reducer/safe'
import balances, { BALANCE_REDUCER_ID, type State as BalancesState } from '~/routes/safe/store/reducer/balances'

export const history = createBrowserHistory()

// eslint-disable-next-line
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const finalCreateStore = composeEnhancers(applyMiddleware(
  thunk,
  routerMiddleware(history),
))

export type GlobalState = {
  providers: ProviderState,
  safes: SafeState,
  balances: BalancesState,
}

const reducers: Reducer<GlobalState> = combineReducers({
  routing: routerReducer,
  [PROVIDER_REDUCER_ID]: provider,
  [SAFE_REDUCER_ID]: safe,
  [BALANCE_REDUCER_ID]: balances,
})

const initialState = {
  [SAFE_REDUCER_ID]: safeInitialState(),
}

export const store: Store<GlobalState> = createStore(reducers, initialState, finalCreateStore)

export const aNewStore = (localState?: Object): Store<GlobalState> =>
  createStore(reducers, localState, finalCreateStore)
