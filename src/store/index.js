// @flow
import { createBrowserHistory } from 'history'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import {
  combineReducers, createStore, applyMiddleware, compose, type Reducer, type Store,
} from 'redux'
import thunk from 'redux-thunk'
import provider, { PROVIDER_REDUCER_ID, type State as ProviderState } from '~/logic/wallets/store/reducer/provider'
import safe, { SAFE_REDUCER_ID, type State as SafeState, safesInitialState } from '~/routes/safe/store/reducer/safe'
import tokens, { TOKEN_REDUCER_ID, type State as TokensState } from '~/logic/tokens/store/reducer/tokens'
import transactions, {
  type State as TransactionsState,
  TRANSACTIONS_REDUCER_ID,
} from '~/routes/safe/store/reducer/transactions'

export const history = createBrowserHistory()

// eslint-disable-next-line
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const finalCreateStore = composeEnhancers(applyMiddleware(thunk, routerMiddleware(history)))

export type GlobalState = {
  providers: ProviderState,
  safes: SafeState,
  tokens: TokensState,
  transactions: TransactionsState,
}

export type GetState = () => GlobalState

const reducers: Reducer<GlobalState> = combineReducers({
  router: connectRouter(history),
  [PROVIDER_REDUCER_ID]: provider,
  [SAFE_REDUCER_ID]: safe,
  [TOKEN_REDUCER_ID]: tokens,
  [TRANSACTIONS_REDUCER_ID]: transactions,
})

const initialState = {
  [SAFE_REDUCER_ID]: safesInitialState(),
}

export const store: Store<GlobalState> = createStore(reducers, initialState, finalCreateStore)

export const aNewStore = (localState?: Object): Store<GlobalState> => createStore(reducers, localState, finalCreateStore)
