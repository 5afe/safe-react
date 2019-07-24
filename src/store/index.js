// @flow
import { createBrowserHistory } from 'history'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import {
  combineReducers, createStore, applyMiddleware, compose, type Reducer, type Store,
} from 'redux'
import thunk from 'redux-thunk'
import provider, { PROVIDER_REDUCER_ID, type State as ProviderState } from '~/logic/wallets/store/reducer/provider'
import safe, { SAFE_REDUCER_ID, type State as SafeState } from '~/routes/safe/store/reducer/safe'
import safeStorage from '~/routes/safe/store/middleware/safeStorage'
import tokens, { TOKEN_REDUCER_ID, type State as TokensState } from '~/logic/tokens/store/reducer/tokens'
import transactions, {
  type State as TransactionsState,
  TRANSACTIONS_REDUCER_ID,
} from '~/routes/safe/store/reducer/transactions'
import snackbarMessages, {
  type State as SnackbarState,
  SNACKBAR_REDUCER_ID,
} from '~/components/Snackbar/store/reducer'

export const history = createBrowserHistory()

// eslint-disable-next-line
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const finalCreateStore = composeEnhancers(applyMiddleware(thunk, routerMiddleware(history), safeStorage))

export type GlobalState = {
  providers: ProviderState,
  safes: SafeState,
  tokens: TokensState,
  transactions: TransactionsState,
  snackbar: SnackbarState,
}

export type GetState = () => GlobalState

const reducers: Reducer<GlobalState> = combineReducers({
  router: connectRouter(history),
  [PROVIDER_REDUCER_ID]: provider,
  [SAFE_REDUCER_ID]: safe,
  [TOKEN_REDUCER_ID]: tokens,
  [TRANSACTIONS_REDUCER_ID]: transactions,
  [SNACKBAR_REDUCER_ID]: snackbarMessages,
})

export const store: Store<GlobalState> = createStore(reducers, finalCreateStore)

export const aNewStore = (localState?: Object): Store<GlobalState> => createStore(reducers, localState, finalCreateStore)
